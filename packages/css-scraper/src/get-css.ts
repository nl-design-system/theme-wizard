import { css_to_tokens as cssToTokens } from '@projectwallace/css-design-tokens';
import { parseHTML } from 'linkedom';
import type {
  CSSImportOrigin,
  CSSInlineStyleOrigin,
  CSSLinkOrigin,
  CSSOrigin,
  CSSStyleTagOrigin,
  PartialCSSLinkOrigin,
} from './css-origin.types.js';
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

const getUrlFromImportRule = (importRule: string): string => {
  const href: string[] = [];

  if (/^['"]/.test(importRule)) {
    const quote = importRule.charCodeAt(0);
    for (let x = 1; x < importRule.length; x++) {
      // Do not make the quotes part of the url
      if (importRule.charCodeAt(x) === quote) {
        break;
      }
      href.push(importRule[x]);
    }
  } else if (importRule.startsWith('url(')) {
    for (let x = 4; x < importRule.length; x++) {
      const character = importRule.charAt(x);
      // End of url() reached
      if (character === ')') {
        break;
      }
      // Do not include quotes as part uf the url
      if (/['"]/.test(character)) {
        continue;
      }
      href.push(character);
    }
  }
  return href.join('');
};

/**
 * @description Parse a string of CSS to get all the `@import url()` URL's if there are any
 */
export const getImportUrls = (css: string): string[] => {
  const urls: string[] = [];

  for (let i = 0; i < css.length; i++) {
    if (!css.startsWith('@import', i)) {
      continue;
    }

    // The first semicolon after @import ends the atrule
    const semicolonIndex = css.indexOf(';', i + `@import`.length);
    const importRule = css.substring(i + '@import'.length, semicolonIndex).trim();
    const url = getUrlFromImportRule(importRule);
    urls.push(url);

    i += importRule.length;
  }

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

    if (message === 'Not Found') {
      throw new NotFoundError(url);
    }
  }

  // throw new ScrapingError('something went wrong', 500, url);
};

export const getCssFile = async (url: string | URL, abortSignal: AbortSignal) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/css,*/*;q=0.1',
        'User-Agent': USER_AGENT,
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
): (CSSStyleTagOrigin | CSSInlineStyleOrigin | PartialCSSLinkOrigin | CSSLinkOrigin)[] => {
  // TODO?: if we want this to run client-side we can use DOMParser and avoid linkedom
  const { document } = parseHTML(html);

  const nodes = document.querySelectorAll<HTMLLinkElement | HTMLStyleElement | HTMLElement>(
    'link[rel*="stylesheet"][href], style, [style]',
  );
  const baseElement = document.querySelector('base[href]');
  const baseHref = baseElement?.getAttribute('href');
  const baseUrl = baseElement !== null && baseHref ? baseHref : url;
  const origins = [];
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
        const linkOrigin = {
          css,
          href,
          media,
          rel,
          type: 'link' as const,
          url: href,
        };
        origins.push(linkOrigin);
      } else {
        const linkOrigin = {
          css: undefined, // still need to fetch CSS from the url
          href,
          media,
          rel,
          type: 'link' as const,
          url: url.toString(),
        };
        origins.push(linkOrigin);
      }
    } else if (node.tagName === 'STYLE') {
      const css = node.textContent.trim();
      if (css.length === 0) continue;
      const styleOrigin = {
        css,
        type: 'style' as const,
        url: url.toString(),
      };
      origins.push(styleOrigin);
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
    const inlineStylesOrigin = {
      css: `:where([css-scraper-inline-styles]) { ${inlinedStyles.join('')} }`,
      type: 'inline' as const,
      url: url.toString(),
    };
    origins.push(inlineStylesOrigin);
  }

  return origins;
};

const fetchHtml = async (url: string | URL, signal: AbortSignal) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,*/*;q=0.1',
      'User-Agent': USER_AGENT,
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

const processOrigins = async (
  origins: (PartialCSSLinkOrigin | CSSLinkOrigin | CSSStyleTagOrigin | CSSInlineStyleOrigin)[],
  abortSignal: AbortSignal,
) => {
  const result: (CSSLinkOrigin | CSSImportOrigin | CSSStyleTagOrigin | CSSInlineStyleOrigin)[] = [];

  for (const origin of origins) {
    if (origin.type === 'link' && !origin.css) {
      origin.css = await getCssFile(origin.url, abortSignal);
      result.push(origin as CSSLinkOrigin);
    } else {
      result.push(origin);
    }

    for (const importUrl of getImportUrls(origin.css as string)) {
      const css = await getCssFile(importUrl, abortSignal);
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

export const getCssOrigins = async (url: string, { timeout = 10000 } = {}): Promise<CSSOrigin[]> => {
  const resolvedUrl = resolveUrl(url);

  if (resolvedUrl === undefined) {
    throw new InvalidUrlError(url);
  }

  // Setup a timeout and abortcontroller so we can stop in-flight fetch requests when we've crossed the timeout limit
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  try {
    const response = await fetchHtml(resolvedUrl, abortController.signal);
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

    const origins = getCssFromHtml(body, resolvedUrl);
    const result = processOrigins(origins, abortController.signal);

    clearTimeout(timeoutId);
    return result;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    handleFetchError(error, resolvedUrl, timeout);
    return [];
  }
};

export { ScrapingError } from './errors.js';
export const getCss = async (url: string): Promise<string> => {
  const origins = await getCssOrigins(url);
  return origins.map(({ css }) => css).join('\n');
};

type Tokens = ReturnType<typeof cssToTokens>;
type ColorToken = Tokens['color'][string];
type FontFamilyToken = Tokens['font_family'][string];
type FontSizeToken = Tokens['font_size'][string];

export const getDesigntokens = async (
  url: string,
): Promise<{
  colors: Record<string, ColorToken>;
  fontFamilies: Record<string, FontFamilyToken>;
  fontSizes: Record<string, FontSizeToken>;
}> => {
  const css = await getCss(url);
  const tokens = cssToTokens(css);

  return {
    colors: tokens.color,
    fontFamilies: tokens.font_family,
    fontSizes: tokens.font_size,
  };
};
