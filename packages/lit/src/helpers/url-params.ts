/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { UrlParamsConfig } from './types';

/**
 * Type-safe URL parameter keys
 */
export const URL_PARAM_KEYS = {
  URL: 'url',
  HEADING_FONT: 'headingFont',
  BODY_FONT: 'bodyFont',
  THEME_CLASS: 'themeClass',
  CUSTOM_CSS: 'customCss',
} as const;

/**
 * Loads URL parameters from the current window location
 * @param keys - Array of parameter keys to load
 * @returns Object with loaded parameters
 * @example
 * ```typescript
 * const params = loadUrlParams(['url', 'headingFont']);
 * // Returns: { url?: string, headingFont?: string }
 * ```
 */
export function loadUrlParams<T extends keyof UrlParamsConfig>(keys: readonly T[]): Pick<UrlParamsConfig, T> {
  const urlParams = new URLSearchParams(window.location.search);
  const result = {} as Pick<UrlParamsConfig, T>;

  keys.forEach((key) => {
    const encodedValue = urlParams.get(key as string);
    if (encodedValue) {
      const decodedValue = safeDecodeUrlParam(encodedValue);
      (result as any)[key] = decodedValue;
    }
  });

  return result;
}

/**
 * Safely encodes a URL parameter value to prevent Vite conflicts
 * @param value - The value to encode
 * @returns Encoded value safe for URL parameters
 */
function safeEncodeUrlParam(value: string): string {
  console.log('safeEncodeUrlParam input:', value);

  // For URLs, use base64 encoding to prevent Vite from interpreting as file paths
  if (value.startsWith('http://') || value.startsWith('https://')) {
    const encoded = btoa(value);
    console.log('safeEncodeUrlParam: URL detected, base64 encoding:', encoded);
    return encoded;
  }

  // For other values, use standard URL encoding
  const encoded = encodeURIComponent(value);
  console.log('safeEncodeUrlParam: Non-URL, URL encoding:', encoded);
  return encoded;
}

/**
 * Safely decodes a URL parameter value
 * @param value - The encoded value to decode
 * @returns Decoded value
 */
function safeDecodeUrlParam(value: string): string {
  try {
    // Try base64 decoding first (for URLs)
    const decoded = atob(value);
    // Check if it's a valid URL
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return decoded;
    }
    // If not a URL, fall back to URL decoding
    return decodeURIComponent(value);
  } catch {
    // If base64 decoding fails, use standard URL decoding
    return decodeURIComponent(value);
  }
}

/**
 * Updates URL parameters in the current browser location
 * @param params - Object with parameters to set
 * @param replace - Whether to replace current history entry (default: true)
 * @example
 * ```typescript
 * updateUrlParams({ url: 'https://example.com', headingFont: 'Arial' });
 * ```
 */
export function updateUrlParams(params: Partial<UrlParamsConfig>, replace = true): void {
  console.log('🔥 updateUrlParams called with params:', params);
  const url = new URL(window.location.href);

  // Clear existing search params first
  url.search = '';

  // Build new search params manually to avoid double encoding
  const searchParams: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      console.log(`updateUrlParams: processing ${key} = ${value}`);
      const encodedValue = safeEncodeUrlParam(String(value));
      const paramString = `${encodeURIComponent(key)}=${encodedValue}`;
      console.log(`updateUrlParams: adding param: ${paramString}`);
      searchParams.push(paramString);
    }
  });

  // Set the search string directly
  if (searchParams.length > 0) {
    url.search = '?' + searchParams.join('&');
  }

  console.log('updateUrlParams: updating URL from', window.location.href, 'to', url.toString());

  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
}

/**
 * Clears all URL parameters
 * @param replace - Whether to replace current history entry (default: true)
 */
export function clearUrlParams(replace = true): void {
  const url = new URL(window.location.href);
  url.search = '';

  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
}

/**
 * Gets a single URL parameter value
 * @param key - Parameter key to get
 * @returns Parameter value or null if not found
 * @example
 * ```typescript
 * const url = getUrlParam('url');
 * ```
 */
export function getUrlParam(key: keyof UrlParamsConfig): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedValue = urlParams.get(key as string);
  return encodedValue ? safeDecodeUrlParam(encodedValue) : null;
}

/**
 * Checks if URL parameters are present
 * @param keys - Keys to check for
 * @returns True if any of the specified keys have values
 * @example
 * ```typescript
 * const hasParams = hasUrlParams(['url', 'headingFont']);
 * ```
 */
export function hasUrlParams(keys: readonly (keyof UrlParamsConfig)[]): boolean {
  const urlParams = new URLSearchParams(window.location.search);

  return keys.some((key) => {
    return urlParams.has(key as string);
  });
}
