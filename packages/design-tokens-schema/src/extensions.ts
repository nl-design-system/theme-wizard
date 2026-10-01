import { dequal } from 'dequal';
import type { TokenSubtype } from './token-subtype';
import type { BaseDesignToken } from './tokens/base-token';
import type { ColorValue } from './tokens/color-token';
import { isValueObject } from './tokens/token-reference';

const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Known extension keys used by `@nl-design-system-community/css-scraper` to annotate scraped tokens.
export const EXTENSION_AUTHORED_AS = 'nl.nldesignsystem.theme-wizard.css-authored-as';
export const EXTENSION_CSS_PROPERTIES = 'nl.nldesignsystem.theme-wizard.css-properties';
export const EXTENSION_TOKEN_ID = 'nl.nldesignsystem.theme-wizard.token-id';
export const EXTENSION_USAGE_COUNT = 'nl.nldesignsystem.theme-wizard.usage-count';
/**
 * @deprecated Same concept as `EXTENSION_TOKEN_SUBTYPE`, just under the scraper's own historic key.
 * TODO: migrate css-scraper onto `EXTENSION_TOKEN_SUBTYPE` and drop this.
 */
export const EXTENSION_SCRAPED_SUBTYPE = 'nl.nldesignsystem.theme-wizard.token-subtype';

// Known extension keys used by theme-wizard-app.
export const EXTENSION_TOKEN_STAGED = 'nl.nldesignsystem.theme-wizard.token-staged';
export const EXTENSION_COLORSCALE_SEED = 'nl.nldesignsystem.theme-wizard.color-scale-seed-color';

/**
 * Maps extension keys (the string literal type of an `EXTENSION_*` const) to their value type.
 *
 * This package is the source of truth for every known `EXTENSION_*` key used across the
 * community monorepo (scraper, theme-wizard-app, etc.), even keys that only one consuming
 * package cares about. Declare new ones directly as members here, next to the others:
 *
 * ```ts
 * export const EXTENSION_FOO = 'nl.nldesignsystem.foo';
 *
 * export interface ExtensionTypeMap {
 *   // ...
 *   [EXTENSION_FOO]: string;
 * }
 * ```
 */
export interface ExtensionTypeMap {
  [key: string]: unknown;
  [EXTENSION_AUTHORED_AS]: string;
  [EXTENSION_CSS_PROPERTIES]: string[];
  [EXTENSION_TOKEN_ID]: string;
  [EXTENSION_USAGE_COUNT]: number;
  [EXTENSION_SCRAPED_SUBTYPE]: TokenSubtype;
  [EXTENSION_TOKEN_STAGED]: boolean;
  [EXTENSION_COLORSCALE_SEED]: ColorValue;
}

/**
 * Read an extension value from a token or group's `$extensions`. Tokens, token groups, and
 * groups of token groups can all carry extensions, so this accepts any of them. Returns the
 * type registered in `ExtensionTypeMap` for known keys, or `unknown` for keys that aren't
 * registered.
 */
export const getExtension = <K extends string>(
  valueObject: Record<string, unknown> | undefined,
  key: K,
): ExtensionTypeMap[K] | undefined => {
  const extensions = valueObject?.['$extensions'];
  if (isValueObject(extensions)) {
    return extensions[key] as ExtensionTypeMap[K];
  }
  return undefined;
};

/**
 * Set a value for an extension. Warning: overwrites existing values if present.
 */
export const setExtension = (token: BaseDesignToken, key: string, value: unknown): void => {
  if (PROTO_KEYS.has(key)) {
    return;
  }
  // Make sure $extensions exists
  token['$extensions'] ??= {};

  // Combine the new value and exising extension value if they're both arrays
  const existing = token['$extensions'][key];
  if (Array.isArray(existing) && Array.isArray(value)) {
    // Only add items that aren't already in there, to avoid duplicates
    const newItems = value.filter((item) => !existing.some((extension: unknown) => dequal(extension, item)));
    token.$extensions[key] = [...existing, ...newItems];
  } else {
    // Otherwise, add or override the extension
    token.$extensions[key] = value;
  }
};
