import { parse, walk } from 'css-tree';
import { parseHTML } from 'linkedom';
import type { CSSOrigin } from './css-origin.types.js';
import { resolveUrl } from './resolve-url.js';
import { isWaybackUrl, removeWaybackToolbar } from './strip-wayback.js';

export const USER_AGENT = 'NL Design System CSS Scraper/1.0';

export const isLocalhostUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.startsWith('192.168.');
  } catch {
    return false;
  }
};

/**
 * @description Parse a string of CSS to get all the `@import url()` URL's if there are any
 */
export const getImportUrls = (css: string): string[] => {
  // TODO: including an entire CSS parser is quite heavy for only getting some `@import url()` rules
  const ast = parse(css, {
    parseAtrulePrelude: true,
    parseCustomProperty: false,
    parseRulePrelude: false,
    parseValue: false,
  });
  const urls: string[] = [];

  walk(ast, function (node) {
    // Can not be a URL inside something else because otherwise this.atrule could never be an import
    // `this` is necessary because it's the only way CSSTree lets us access a parent rule
    // eslint-disable-next-line no-invalid-this
    if ((node.type === 'Url' || node.type === 'String') && this.atrule?.name === 'import') {
      // TODO: support base64-encoded URL's?
      urls.push(node.value);
    }
  });
  return urls;
};

const getCssFile = async (url: string | URL, abortSignal: AbortSignal) => {
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

export const getCssFromHtml = (html: string, url: string | URL) => {
  // TODO: if we want this to run client-side we can use DOMParser and avoid linkedom
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
      const url = resolveUrl(href, baseUrl);
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
          type: 'link',
          url: href,
        };
        origins.push(linkOrigin);
      } else {
        if (!url) continue;
        const linkOrigin = {
          css: undefined, // still need to fetch CSS from the url
          href,
          media,
          rel,
          type: 'link',
          url: url.toString(),
        };
        origins.push(linkOrigin);
      }
    } else if (node.tagName === 'STYLE') {
      const css = node.textContent.trim();
      if (css.length === 0) continue;
      const styleOrigin = {
        css,
        type: 'style',
        url,
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
      type: 'inline',
      url,
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

export const getCss = async (
  url: string,
  { timeout = 10000 } = {},
): Promise<
  | CSSOrigin[]
  | {
      error: {
        message: string;
        statusCode: number;
        url: string;
      };
    }
> => {
  const resolvedUrl = resolveUrl(url);

  if (resolvedUrl === undefined) {
    return {
      error: {
        message: 'The URL is not valid. Are you sure you entered a URL and not CSS?',
        statusCode: 400,
        url,
      },
    };
  }

  let body: string;
  let contentType: string | null;

  // Setup a timeout and abortcontroller so we can stop in-flight fetch requests when we've crossed timeout limit
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  try {
    const response = await fetchHtml(resolvedUrl, abortController.signal);
    body = response.body;
    contentType = response.contentType;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (typeof error === 'object' && error !== null && 'message' in error) {
      // Examples: chatgpt.com
      if (error.message === 'Forbidden') {
        return {
          error: {
            message:
              'The origin server responded with a 403 Forbidden status code which means that scraping CSS is blocked. Is the URL publicly accessible?',
            statusCode: 403,
            url,
          },
        };
      }

      // Examples: localhost, sduhsdf.test
      if (error.message === 'fetch failed') {
        let message = 'The origin server is refusing connections.';
        if (isLocalhostUrl(url)) {
          message += ' You are trying to scrape a local server. Make sure to use a public URL.';
        }

        return {
          error: {
            message,
            statusCode: 400,
            url,
          },
        };
      }

      // Examples: projectwallace.com/auygsdjhgsj
      if (error.message === 'Not Found') {
        return {
          error: {
            message: 'The origin server responded with a 404 Not Found status code.',
            statusCode: 404,
            url,
          },
        };
      }
    }

    // Generic error handling (TODO: add test case)
    return {
      error: {
        message: 'something went wrong',
        statusCode: 500,
        url,
      },
    };
  }

  // Return early if our response was a CSS file already
  if (contentType?.includes('text/css')) {
    clearTimeout(timeoutId);
    return [
      {
        css: body,
        href: url,
        type: 'file',
      },
    ];
  }

  if (isWaybackUrl(url)) {
    body = removeWaybackToolbar(body);
  }

  const result: CSSOrigin[] = [];

  const origins = getCssFromHtml(body, resolvedUrl);

  for (const origin of origins) {
    if (origin.type === 'link' && !origin.css) {
      origin.css = await getCssFile(origin.url, abortController.signal);
    }
    // casting `origin.css` to `as string` is safe here because we've fetched the CSS in case it wasn't there before
    for (const importUrl of getImportUrls(origin.css as string)) {
      const css = await getCssFile(importUrl, abortController.signal);
      origins.push({
        css,
        type: 'import',
        url: importUrl,
      });
    }
  }

  clearTimeout(timeoutId);

  return result;
};
