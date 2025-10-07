/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { UrlParamsConfig } from './types';

/**
 * Loads URL parameters from the current window location
 * @param keys - Array of parameter keys to load
 * @returns Object with loaded parameters
 * @example
 * ```typescript
 * const params = loadUrlParams(['sourceUrl', 'headingFont']);
 * // Returns: { sourceUrl?: string, headingFont?: string }
 * ```
 */
export const loadUrlParams = <T extends keyof UrlParamsConfig>(keys: readonly T[]): Pick<UrlParamsConfig, T> => {
  const urlParams = new URLSearchParams(window.location.search);
  const result = {} as Pick<UrlParamsConfig, T>;

  keys.forEach((key) => {
    const encodedValue = urlParams.get(key as string);
    result[key] = encodedValue || '';
  });

  return result;
};

/**
 * Safely decodes a URL parameter value
 * @param value - The encoded value to decode
 * @returns Decoded value
 */
const safeDecodeUrlParam = (value: string): string => {
  return decodeURIComponent(value);
};

/**
 * Gets the current URL
 * @returns The current URL
 */
const getCurrentUrl = (): URL => {
  try {
    return new URL(window.location.href);
  } catch (error) {
    console.error('Invalid current URL:', error);
    return new URL('');
  }
};

/**
 * Converts a URL to its hostname
 * @param url - The URL to convert
 * @returns The hostname of the URL
 */
const toHost = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

/**
 * Update browser URL parameters with current configuration
 * @private
 */
export const updateURLParameters = (params: Record<string, string>, defaultConfig: UrlParamsConfig): void => {
  const url: URL = getCurrentUrl();

  const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = params;

  // Only set non-default values to keep URL clean
  if (sourceUrl && sourceUrl !== defaultConfig.sourceUrl) {
    const host = toHost(sourceUrl);
    url.searchParams.set('sourceUrl', host);
  } else {
    url.searchParams.delete('sourceUrl');
  }

  if (headingFont && headingFont !== defaultConfig.headingFont) {
    url.searchParams.set('headingFont', headingFont);
  } else {
    url.searchParams.delete('headingFont');
  }

  if (bodyFont && bodyFont !== defaultConfig.bodyFont) {
    url.searchParams.set('bodyFont', bodyFont);
  } else {
    url.searchParams.delete('bodyFont');
  }

  if (themeClass && themeClass !== defaultConfig.themeClass) {
    url.searchParams.set('themeClass', themeClass);
  } else {
    url.searchParams.delete('themeClass');
  }

  if (customCss) {
    url.searchParams.set('customCss', customCss);
  } else {
    url.searchParams.delete('customCss');
  }

  window.history.replaceState({}, '', url.toString());
};
/**
 * Clears all URL parameters
 * @param replace - Whether to replace current history entry (default: true)
 */
export const clearUrlParams = (replace = true): void => {
  const url = new URL(window.location.href);
  url.search = '';

  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', url.toString());
};

/**
 * Gets a single URL parameter value
 * @param key - Parameter key to get
 * @returns Parameter value or null if not found
 * @example
 * ```typescript
 * const url = getUrlParam('url');
 * ```
 */
export const getUrlParam = (key: keyof UrlParamsConfig): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedValue = urlParams.get(key as string);
  return encodedValue ? safeDecodeUrlParam(encodedValue) : null;
};

/**
 * Checks if URL parameters are present
 * @param keys - Keys to check for
 * @returns True if any of the specified keys have values
 * @example
 * ```typescript
 * const hasParams = hasUrlParams(['url', 'headingFont']);
 * ```
 */
export const hasUrlParams = (keys: readonly (keyof UrlParamsConfig)[]): boolean => {
  const urlParams = new URLSearchParams(window.location.search);

  return keys.some((key) => {
    return urlParams.has(key as string);
  });
};
