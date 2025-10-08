/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { UrlParamsConfig } from './types';

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

/**
 * Validation methods
 * @private
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

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

const normalize = (v: string): string => {
  const s = v.trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  // blokkeer niet-http(s) protocollen
  if (/^[a-z]+:\/\//i.test(s)) return '';
  return `https://${s}`;
};

/**
 * Update browser URL parameters with current configuration
 * @private
 */
export const updateURLParameters = (params: Partial<UrlParamsConfig>, defaultConfig: UrlParamsConfig): void => {
  const url: URL = getCurrentUrl();

  const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = params;

  // Only set non-default values to keep URL clean
  if (sourceUrl && sourceUrl !== defaultConfig.sourceUrl) {
    const normalized = normalize(sourceUrl);
    url.searchParams.set('sourceUrl', normalized);
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
