import { dequal } from 'dequal';
import type { BaseDesignToken } from './tokens/base-token';

/**
 * Set a value for an extension. Warning: overwrites existing values if present.
 */
export const setExtension = (token: BaseDesignToken, key: string, value: unknown): void => {
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
