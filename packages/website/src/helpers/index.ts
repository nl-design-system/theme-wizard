/**
 * Helper utilities for URL normalization and CSS scoping.
 */

/** Convert a possibly-relative URL to absolute using a base URL. */
export function toAbsolute(value: string | null, baseUrl: string): string | null {
  if (!value) return value;
  const v = value.trim();
  if (!v || v.startsWith('http') || v.startsWith('data:') || v.startsWith('blob:')) return v;
  try {
    return new URL(v, baseUrl).href;
  } catch {
    return v;
  }
}

/** Rewrite a srcset list to absolute URLs using a base URL. */
export function rewriteSrcset(value: string | null, baseUrl: string): string | null {
  if (!value) return value;
  const parts = value.split(',').map((part) => part.trim());
  const rewritten = parts
    .map((part) => {
      const tokens = part.split(/\s+/);
      if (tokens.length === 0) return part;
      const urlToken = tokens[0];
      const abs = toAbsolute(urlToken, baseUrl);
      if (!abs) return part;
      tokens[0] = abs;
      return tokens.join(' ');
    })
    .join(', ');
  return rewritten;
}

/** Scope :root to :host for Shadow DOM and rewrite url(...) to absolute. */
export function scopeAndRewriteCss(baseUrl: string, css: string): string {
  let out = css.replace(/:root(\s*)\{/g, ':host$1{');
  out = out.replace(/url\(([^)]+)\)/g, (match, p1) => {
    const raw = String(p1)
      .trim()
      .replace(/(?:^["']|["']$)/g, '');
    try {
      const abs = new URL(raw, baseUrl).href;
      return `url(${abs})`;
    } catch {
      return match;
    }
  });
  return out;
}

/** Rewrite common element attributes that contain URLs to absolute URLs. */
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

/** Handle legacy SVG xlink:href attributes by rewriting to absolute URLs. */
export function rewriteSvgXlinkToAbsolute(root: ParentNode, baseUrl: string): void {
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const svgImages = root.querySelectorAll('image') as NodeListOf<SVGImageElement>;
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

/** Normalize inline style url(...) values inside style attributes to absolute. */
export function rewriteInlineStyleAttributesToAbsolute(root: ParentNode, baseUrl: string): void {
  const styledNodes = root.querySelectorAll('[style]');
  styledNodes.forEach((el: Element) => {
    const styleVal = el.getAttribute('style') || '';
    const rewritten = styleVal.replace(/url\(([^)]+)\)/g, (match, p1) => {
      const raw = String(p1)
        .trim()
        .replace(/(?:^["']|["']$)/g, '');
      const abs = toAbsolute(raw, baseUrl);
      return abs ? `url(${abs})` : match;
    });
    if (rewritten !== styleVal) el.setAttribute('style', rewritten);
  });
}

/** Extract absolute stylesheet URLs from a document head. */
export function extractStylesheetUrls(head: ParentNode, baseUrl: string): string[] {
  const linkElements = head.querySelectorAll('link[rel="stylesheet"]');
  const stylesheetUrls: string[] = [];
  linkElements.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        stylesheetUrls.push(absoluteUrl);
      } catch {
        console.error('Failed to convert href to absolute URL', href);
      }
    }
  });
  return stylesheetUrls;
}

/** Fetch external stylesheets through proxy, scope and rewrite URLs, and combine. */
export async function fetchAndProcessExternalStylesheets(urls: string[]): Promise<string> {
  const stylesheetPromises = urls.map((url) =>
    fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
      .then((res) => res.text())
      .then((css) => scopeAndRewriteCss(url, css))
      .catch(() => ''),
  );
  const parts = await Promise.all(stylesheetPromises);
  return parts.join('\n\n');
}

/** Extract inline <style> content from head and scope/rewrite CSS. */
export function extractAndProcessInlineHeadStyles(head: ParentNode, baseUrl: string): string {
  const styleElements = head.querySelectorAll('style');
  let combined = '';
  styleElements.forEach((style) => {
    const styleContent = style.textContent || '';
    combined += scopeAndRewriteCss(baseUrl, styleContent) + '\n';
  });
  return combined;
}

/** Process custom CSS provided by host app for Shadow DOM scoping and absolute URLs. */
export function processCustomCss(customCss: string, baseUrl: string): string {
  if (!customCss) return '';
  return scopeAndRewriteCss(baseUrl, customCss);
}

/** Fetch HTML as text. */
export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return await response.text();
}

/** Parse HTML string to a Document. */
export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}
