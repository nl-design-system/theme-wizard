/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

/**
 * Scope :root to :host for Shadow DOM and rewrite url(...) to absolute.
 * @param baseUrl - Base URL for relative URLs in CSS
 * @param css - CSS string to process
 * @returns Processed CSS with Shadow DOM scoping and absolute URLs
 */
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

/**
 * Extract absolute stylesheet URLs from a document head.
 * @param head - Document head element
 * @param baseUrl - Base URL for relative URLs
 * @returns Array of absolute stylesheet URLs
 */
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

/**
 * Fetch external stylesheets through proxy, scope and rewrite URLs, and combine.
 * @param urls - Array of stylesheet URLs to fetch
 * @returns Combined CSS string with processed stylesheets
 */
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

/**
 * Extract inline <style> content from head and scope/rewrite CSS.
 * @param head - Document head element
 * @param baseUrl - Base URL for relative URLs
 * @returns Combined CSS string with processed inline styles
 */
export function extractAndProcessInlineHeadStyles(head: ParentNode, baseUrl: string): string {
  const styleElements = head.querySelectorAll('style');
  let combined = '';
  styleElements.forEach((style) => {
    const styleContent = style.textContent || '';
    combined += scopeAndRewriteCss(baseUrl, styleContent) + '\n';
  });
  return combined;
}

/**
 * Process custom CSS provided by host app for Shadow DOM scoping and absolute URLs.
 * @param customCss - Custom CSS string
 * @param baseUrl - Base URL for relative URLs
 * @returns Processed CSS string
 */
export function processCustomCss(customCss: string, baseUrl: string): string {
  if (!customCss) return '';
  return scopeAndRewriteCss(baseUrl, customCss);
}
