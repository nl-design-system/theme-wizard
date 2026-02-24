import type { BaseDesignToken } from './tokens/base-token';

/**
 * Set a value for an extension. Warning: overwrites existing values if present.
 */
export const setExtension = (token: BaseDesignToken, key: string, value: unknown): void => {
  // Make sure $extensions exists
  token['$extensions'] ??= {};
  token['$extensions'][key] = value;
};
