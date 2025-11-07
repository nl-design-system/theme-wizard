import { ColorToken, ColorTokenValidationSchema } from './color-token';
import { isTokenWithRef, type TokenWithRef } from './token-reference';

/**
 * @param root The object you want to traverse
 * @param predicate Predicate function that returns true when data is a <T>-shape object
 * @param callback Is called whenever the callback returns true
 */
export const walkObject = <T = unknown>(
  root: unknown,
  predicate: (data: unknown, path: string[]) => data is T,
  callback?: (data: T, path: string[]) => void,
): void => {
  function traverse(currentData: unknown, path: string[]): void {
    // Check if current data matches
    if (predicate(currentData, path)) {
      callback?.(currentData, path);
    }

    // Recurse into objects
    if (typeof currentData === 'object' && currentData !== null && !Array.isArray(currentData)) {
      for (const key in currentData) {
        traverse((currentData as Record<string, unknown>)[key], [...path, key]);
      }
    }

    // Recurse into arrays
    if (Array.isArray(currentData)) {
      for (let i = 0; i < currentData.length; i++) {
        traverse(currentData[i], [...path, String(i)]);
      }
    }
  }

  traverse(root, []);
};

const isColorToken = (obj: unknown): obj is ColorToken => {
  return ColorTokenValidationSchema.safeParse(obj).success;
};

export const walkColors = (root: unknown, callback: (data: ColorToken, path: string[]) => void): void => {
  walkObject<ColorToken>(root, isColorToken, callback);
};

export const walkTokensWithRef = (
  root: unknown,
  config: Record<string, unknown>,
  callback: (token: TokenWithRef) => void,
): void => {
  walkObject<TokenWithRef>(root, (data): data is TokenWithRef => isTokenWithRef(data, config), callback);
};
