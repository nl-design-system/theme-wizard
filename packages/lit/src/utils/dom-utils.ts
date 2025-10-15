import { toAbsolute, rewriteSrcset } from './url-utils';

/**
 * Rewrite common element attributes that contain URLs to absolute URLs.
 * @param root - Root element to process
 * @param baseUrl - Base URL for relative URLs
 */
export function rewriteAttributeUrlsToAbsolute(root: ParentNode, baseUrl: string): void {
  const attrSelectors = [
    ['img', 'src'],
    ['img', 'srcset'],
    ['source', 'src'],
    ['source', 'srcset'],
    ['video', 'poster'],
    ['video', 'src'],
    ['audio', 'src'],
    ['a', 'href'],
    ['link', 'href'],
    ['script', 'src'],
    ['use', 'href'],
    ['image', 'href'],
  ] as const;

  attrSelectors.forEach(([tag, attr]) => {
    const nodes = root.querySelectorAll(`${tag}[${attr}]`);
    nodes.forEach((el: Element) => {
      const val = el.getAttribute(attr);
      const abs = attr === 'srcset' ? rewriteSrcset(val, baseUrl) : toAbsolute(val, baseUrl);
      if (abs && abs !== val) el.setAttribute(attr, abs);
    });
  });
}

/**
 * Handle legacy SVG xlink:href attributes by rewriting to absolute URLs.
 * @param root - Root element to process
 * @param baseUrl - Base URL for relative URLs
 */
export function rewriteSvgXlinkToAbsolute(root: ParentNode, baseUrl: string): void {
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const svgImages = root.querySelectorAll<SVGImageElement>('image');
  svgImages.forEach((img) => {
    const legacy = img.getAttribute('xlink:href');
    const current = img.getAttribute('href');
    const val = legacy ?? current;
    const abs = toAbsolute(val, baseUrl);
    if (abs && abs !== val) {
      if (legacy !== null) {
        img.setAttributeNS(xlinkNS, 'xlink:href', abs);
      } else if (current !== null) {
        img.setAttribute('href', abs);
      }
    }
  });
}

/**
 * Fetch HTML as text.
 * @param url - URL to fetch HTML from
 * @returns HTML content as string
 * @throws Error if fetch fails
 */
export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return await response.text();
}

/**
 * Parse HTML string to a Document.
 * @param html - HTML string to parse
 * @returns Parsed HTML Document
 */
export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}
