import type { BaseDesignTokenValue } from './tokens/base-token';

export const setExtension = (token: BaseDesignTokenValue, key: string, value: unknown): void => {
  // Make sure $extensions exists
  token['$extensions'] ??= {};
  token['$extensions'][key] = value;
};
