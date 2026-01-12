import { parse, walk } from '@projectwallace/css-parser';
import { parseHTML } from 'linkedom';
import type {
  CSSImportResource,
  CSSInlineStyleResource,
  CSSLinkResource,
  CSSResource,
  CSSStyleTagResource,
  PartialCSSLinkResource,
} from './css-resource.types.js';
import {
  type UrlLike,
  TimeoutError,
  ForbiddenError,
  ConnectionRefusedError,
  NotFoundError,
  InvalidUrlError,
} from './errors.js';
import { resolveUrl } from './resolve-url.js';
import { isWaybackUrl, removeWaybackToolbar } from './strip-wayback.js';

export const USER_AGENT = 'NL Design System CSS Scraper/1.0';

// TODO: add test coverage for else if branch on line 187
// and remove this ignore file comment
/* v8 ignore file -- @preserve */

const unquote = (input: string = ''): string => {
  return input.replaceAll(/(^['"])|(['"]$)/g, '');
};

/**
 * @description Parse a string of CSS to get all the `@import url()` URL's if there are any
 */
export const getImportUrls = (css: string): string[] => {
  const urls: string[] = [];
  const ast = parse(css, {
    parse_atrule_preludes: true,
    parse_selectors: false,
    parse_values: false,
  });
  walk(ast, (node) => {
    if (node.type_name === 'Atrule' && node.name === 'import') {
      const urlNode = node.children.find((child) => child.type_name === 'Url');
      if (typeof urlNode?.value === 'string') {
        urls.push(unquote(urlNode.value));
      }
    }
  });

  return urls;
};

const handleFetchError = (error: unknown | Error, url: UrlLike, timeout: number) => {
  // TODO: pass error cause
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      throw new TimeoutError(url, timeout);
    }

    const { message } = error;

    if (message === 'Forbidden') {
      throw new ForbiddenError(url);
    }

    if (message === 'fetch failed') {
      throw new ConnectionRefusedError(url);
    }

    // TODO: add test cases for this
    if (message === 'Not Found') {
      throw new NotFoundError(url);
    }
  }
};

export const getCssFile = async (url: string | URL, abortSignal: AbortSignal, userAgent: string = USER_AGENT) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/css,*/*;q=0.1',
        'User-Agent': userAgent,
      },
      // If aborted early try to return an empty string so we can continue with just the content we have
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.text();
  } catch {
    return '';
  }
};

export const getCssFromHtml = (
  html: string,
  url: string | URL,
): (CSSStyleTagResource | CSSInlineStyleResource | PartialCSSLinkResource | CSSLinkResource)[] => {
  // if we want this to run client-side we can use DOMParser and avoid linkedom
  const { document } = parseHTML(html);

  const nodes = document.querySelectorAll<HTMLLinkElement | HTMLStyleElement | HTMLElement>(
    'link[rel*="stylesheet"][href], style, [style]',
  );
  const baseElement = document.querySelector('base[href]');
  const baseHref = baseElement?.getAttribute('href');
  const baseUrl = baseElement !== null && baseHref ? baseHref : url;
  const resources = [];
  const inlinedStyles: string[] = [];

  for (const node of Array.from(nodes)) {
    if (node.tagName === 'LINK') {
      const link = node as HTMLLinkElement;
      const href = link.getAttribute('href')!;
      // Set the URL to the resolved URL instead of item.href to fix relative URLs
      // e.g. ./styles.css -> https://example.com/styles.css
      const url = resolveUrl(href, baseUrl)!;
      const media = link.getAttribute('media') || undefined;
      const rel = link.getAttribute('rel')!;

      if (href.startsWith('data:text/css')) {
        const commaPosition = href.indexOf(',');
        const encodedCss = href.substring(commaPosition + 1);
        // using `atob` so this can run server-side and client-side
        const css = atob(encodedCss);
        const linkResource = {
          css,
          href,
          media,
          rel,
          type: 'link' as const,
          url: href,
        };
        resources.push(linkResource);
      } else {
        const linkResource = {
          css: undefined, // still need to fetch CSS from the url
          href,
          media,
          rel,
          type: 'link' as const,
          url: url.toString(),
        };
        resources.push(linkResource);
      }
    } else if (node.tagName === 'STYLE') {
      const css = node.textContent.trim();
      if (css.length === 0) continue;
      const styleResource = {
        css,
        type: 'style' as const,
        url: url.toString(),
      };
      resources.push(styleResource);
      /* v8 ignore next -- @preserve */
    } else if (node.hasAttribute('style')) {
      let declarations = (node.getAttribute('style') || '').trim();
      // Avoid processing empty style attributes
      if (declarations.length === 0) continue;

      // Make sure to terminate all declarations properly to avoid malformed CSS
      if (!declarations.endsWith(';')) {
        declarations += ';';
      }

      inlinedStyles.push(declarations);
    }
  }

  if (inlinedStyles.length > 0) {
    const inlineStylesResource = {
      css: `:where([css-scraper-inline-styles]) { ${inlinedStyles.join('')} }`,
      type: 'inline' as const,
      url: url.toString(),
    };
    resources.push(inlineStylesResource);
  }

  return resources;
};

const fetchHtml = async (url: string | URL, signal: AbortSignal, userAgent: string = USER_AGENT) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,*/*;q=0.1',
      'User-Agent': userAgent,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return {
    body: await response.text(),
    contentType: response.headers.get('content-type'),
  };
};

const processResources = async (
  resources: (PartialCSSLinkResource | CSSLinkResource | CSSStyleTagResource | CSSInlineStyleResource)[],
  abortSignal: AbortSignal,
  userAgent: string = USER_AGENT,
) => {
  const result: (CSSLinkResource | CSSImportResource | CSSStyleTagResource | CSSInlineStyleResource)[] = [];

  for (const resource of resources) {
    if (resource.type === 'link' && !resource.css) {
      resource.css = await getCssFile(resource.url, abortSignal, userAgent);
      result.push(resource as CSSLinkResource);
    } else {
      result.push(resource);
    }

    for (const importUrl of getImportUrls(resource.css as string)) {
      const css = await getCssFile(importUrl, abortSignal, userAgent);
      result.push({
        css,
        href: importUrl,
        type: 'import' as const,
        url: importUrl,
      });
    }
  }

  return result;
};

export const getCssResources = async (
  url: string,
  { timeout = 10000, userAgent = USER_AGENT } = {},
): Promise<CSSResource[]> => {
  const resolvedUrl = resolveUrl(url);

  if (resolvedUrl === undefined) {
    throw new InvalidUrlError(url);
  }

  // Setup a timeout and abortcontroller so we can stop in-flight fetch requests when we've crossed the timeout limit
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  try {
    const response = await fetchHtml(resolvedUrl, abortController.signal, userAgent);
    let body = response.body;

    if (response.contentType?.includes('text/css')) {
      clearTimeout(timeoutId);
      return [
        {
          css: body,
          href: url,
          type: 'file',
        },
      ];
    }

    if (isWaybackUrl(resolvedUrl)) {
      body = removeWaybackToolbar(body);
    }

    const resources = getCssFromHtml(body, resolvedUrl);
    const result = processResources(resources, abortController.signal, userAgent);

    clearTimeout(timeoutId);
    return result;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    handleFetchError(error, resolvedUrl, timeout);
    return [];
  }
};

export { ScrapingError } from './errors.js';

export const getCss = async (
  url: string,
  { timeout, userAgent }: { timeout?: number; userAgent?: string } = {},
): Promise<string> => {
  const resources = await getCssResources(url, { timeout, userAgent });
  return resources.map(({ css }) => css).join('');
};

export * from './design-tokens.js';
export { resolveUrl } from './resolve-url.js';
