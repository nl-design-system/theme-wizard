import type { BaseDesignToken } from './tokens/base-token';

/**
 * Set a value for an extension. Warning: overwrites existing values if present.
 */
export const setExtension = (token: BaseDesignToken, key: string, value: unknown): void => {
  // Make sure $extensions exists
  token['$extensions'] ??= {};

  // Combine the new value and exising extention value if they're both arrays
  if (Array.isArray(token['$extensions'][key]) && Array.isArray(value)) {
    token.$extensions[key] = [...token.$extensions[key], ...value];
  } else {
    // Otherwise, add or override the extension
    token.$extensions[key] = value;
  }
};
