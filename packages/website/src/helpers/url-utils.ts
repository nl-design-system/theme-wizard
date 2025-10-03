/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

/**
 * Convert a possibly-relative URL to absolute using a base URL.
 * @param value - URL to convert (can be relative or absolute)
 * @param baseUrl - Base URL for relative URLs
 * @returns Absolute URL or original value if invalid
 */
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

/**
 * Rewrite a srcset list to absolute URLs using a base URL.
 * @param value - Srcset string to rewrite
 * @param baseUrl - Base URL for relative URLs
 * @returns Rewritten srcset with absolute URLs
 */
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
