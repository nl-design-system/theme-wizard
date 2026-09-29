import { dequal } from 'dequal';
import type { BaseDesignToken } from './tokens/base-token';
import { isValueObject } from './tokens/token-reference';

const PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Maps extension keys (the string literal type of an `EXTENSION_*` const) to their value type.
 * Other packages can add entries for their own `EXTENSION_*` consts via declaration merging:
 *
 * ```ts
 * declare module '@nl-design-system-community/design-tokens-schema' {
 *   interface ExtensionTypeMap {
 *     [EXTENSION_COLORSCALE_SEED]: string;
 *   }
 * }
 * ```
 */
export interface ExtensionTypeMap {
  [key: string]: unknown;
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
