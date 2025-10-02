import { parse, walk } from 'css-tree';
import { parseHTML } from 'linkedom';
import { resolveUrl } from './resolve-url.js';
import { isWaybackUrl } from './strip-wayback.js';

export const USER_AGENT = 'NL Design System CSS Scraper/1.0';

/**
 * @description Parse a string of CSS to get all the `@import url()` URL's if there are any
 */
const getImportUrls = (css: string): string[] => {
  // TODO: including an entire CSS parser is quite heavy for only getting some `@import url()` rules
  const ast = parse(css, {
    parseAtrulePrelude: false,
    parseCustomProperty: false,
    parseRulePrelude: false,
    parseValue: false,
  });
  const urls: string[] = [];

  walk(ast, function (node) {
    // Can not be a URL inside something else because otherwise this.atrule could never be an import
    // eslint-disable-next-line no-invalid-this
    if (node.type === 'Url' && this.atrule?.name === 'import') {
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

const getStyles = (nodes: NodeListOf<Element>, baseUrl: string) => {
  const items = [];
  const inlineStyles: string[] = [];

  for (const node of Array.from(nodes)) {
    if (node.nodeName === 'LINK') {
      const href = node.getAttribute('href');
      items.push({
        css: '',
        href,
        media: node.getAttribute('media'),
        rel: node.getAttribute('rel'),
        type: 'link',
        url: href !== null && href.startsWith('http') ? href : baseUrl + href,
      });
    } else if (node.nodeName === 'STYLE' && node.textContent !== null && node.textContent.trim().length > 0) {
      const css = node.textContent;
      items.push({
        css,
        type: 'style',
        url: baseUrl,
      });
    } else if (node.hasAttribute('style')) {
      let declarations = (node.getAttribute('style') || '').trim();
      if (declarations.length === 0) continue;

      // I forgot why I added this, but it's apparently important
      if (!declarations.endsWith(';')) {
        declarations += ';';
      }

      // Try to add a class name to the selector
      const classAttribute = node.getAttribute('class');
      let className = '';
      if (classAttribute !== null && classAttribute.length > 0) {
        className += '.';
        className += classAttribute
          .split(/\s+/g)
          .filter((s: string) => {
            if (s.length === 0) return false;
            if (s.length === 1) {
              const code = s.charCodeAt(0);
              if (code < 48 || code > 122) return false; // 0-9a-zA-Z range
            }
            return true;
          })
          .map((s: string) => s.replaceAll(/(\[|\]|:|\.|\/)/g, '\\$1'))
          .join('.');
      }
      const nodeName = node.nodeName.toLocaleLowerCase();
      inlineStyles.push(`${nodeName}${className} { ${declarations} }\n`);
    }
  }

  if (inlineStyles.length > 0) {
    const inlined = [`/* Start extracted inline styles */`, ...inlineStyles, '/** End extracted inline styles */'].join(
      '\n',
    );

    items.push({
      css: inlined,
      type: 'inline',
      url: baseUrl,
    });
  }

  return items;
};

export const getCss = async (url: string, { timeout = 10000 } = {}) => {
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
  let headers: Headers;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  try {
    const response = await fetch(resolvedUrl, {
      headers: {
        Accept: 'text/html,*/*;q=0.1',
        'User-Agent': USER_AGENT,
      },
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    body = await response.text();
    headers = response.headers;
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
        if (url.includes('localhost') || url.includes('192.168') || url.includes('127.0.0.1')) {
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
  if (headers.get('content-type')?.includes('text/css')) {
    clearTimeout(timeoutId);
    return [
      {
        css: body,
        href: url,
        type: 'file',
      },
    ];
  }

  // Remove the Wayback Machine toolbar if it's present
  const START_COMMENT = '<!-- BEGIN WAYBACK TOOLBAR INSERT -->';
  const END_COMMENT = '<!-- END WAYBACK TOOLBAR INSERT -->';

  const startInsert = body.indexOf(START_COMMENT);
  const endInsert = body.indexOf(END_COMMENT);

  if (startInsert !== -1 && endInsert !== -1) {
    body = body.substring(0, startInsert) + body.substring(endInsert + END_COMMENT.length);
  }

  const { document } = parseHTML(body);

  // If the URL is an archive.org URL, we need to strip out the archive injected stuff
  if (isWaybackUrl(url)) {
    const injectedLinks = document.querySelectorAll<HTMLLinkElement>(
      'link[rel="stylesheet"][href^="https://web-static.archive.org"]',
    );
    for (const link of Array.from(injectedLinks)) {
      link.remove();
    }
  }

  const nodes = document.querySelectorAll<HTMLLinkElement>('link[rel*="stylesheet"][href], style, [style]');
  const baseElement = document.querySelector('base[href]');
  const baseUrl =
    baseElement !== null && baseElement.hasAttribute('href') ? baseElement.getAttribute('href') : resolvedUrl;
  const items = getStyles(nodes, baseUrl?.toString() || '') || [];
  const result = [];

  for (const item of items) {
    if (item.type === 'link' && item.href) {
      if (item.href.startsWith('data:text/css')) {
        const commaPosition = item.href.indexOf(',');
        const encoded = item.href.substring(commaPosition);
        item.css = Buffer.from(encoded, 'base64').toString('ascii');
      } else {
        const fileUrl = resolveUrl(item.href, resolvedUrl);
        if (fileUrl === undefined) {
          continue;
        }
        item.css = await getCssFile(fileUrl, abortController.signal);
        // Set the URL to the resolved URL instead of item.href to fix relative URLs
        // e.g. ./styles.css -> https://example.com/styles.css
        item.url = fileUrl.toString();
      }

      result.push(item);
    }

    if (item.type === 'style' || item.type === 'inline') {
      result.push(item);
    }

    if (item.type === 'style' || item.type === 'link') {
      // Resolve @import CSS 1 level deep (to avoid infinite loops)
      // And c'mon, don't @import inside your @import.
      const importUrls = getImportUrls(item.css);
      if (importUrls.length > 0) {
        const cssRequests = importUrls.map((importUrl) =>
          getCssFile(resolveUrl(importUrl, url)!, abortController.signal),
        );
        const importedFiles = await Promise.all(cssRequests);
        importedFiles.forEach((css, index) => {
          result.push({
            css,
            href: importUrls[index],
            type: 'import',
          });
        });
      }
    }
  }

  clearTimeout(timeoutId);

  return result;
}
