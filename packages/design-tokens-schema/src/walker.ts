import { ColorToken } from './tokens/color-token';
import { DimensionToken, DimensionTokenSchema } from './tokens/dimension-token';
import { isTokenLike, isTokenWithRef, type TokenWithRefLike } from './tokens/token-reference';

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
  const visited = new WeakSet();

  function traverse(currentData: unknown, path: string[]): void {
    // Check if current data matches
    if (predicate(currentData, path)) {
      callback?.(currentData, path);
    }

    // Recurse into objects
    if (typeof currentData === 'object' && currentData !== null && !Array.isArray(currentData)) {
      if (visited.has(currentData)) return;
      visited.add(currentData);

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

const isColorToken = (token: unknown): token is ColorToken => {
  return typeof token === 'object' && token !== null && '$type' in token && token.$type === 'color';
};

export const walkColors = (root: unknown, callback: (token: ColorToken, path: string[]) => void): void => {
  walkObject<ColorToken>(root, isColorToken, callback);
};

export const walkTokensWithRef = (
  root: unknown,
  config: Record<string, unknown>,
  callback: (token: TokenWithRefLike, path: string[]) => void,
): void => {
  walkObject<TokenWithRefLike>(
    root,
    (token, path): token is TokenWithRefLike => {
      try {
        return isTokenWithRef(token, config, path);
      } catch {
        // If the ref is invalid, skip it - validation will catch it later
        return false;
      }
    },
    callback,
  );
};

type LineHeightToken = {
  $type: 'lineHeight';
  $value: unknown;
};

const isLineHeightToken = (token: unknown): token is LineHeightToken => {
  return typeof token === 'object' && token !== null && '$type' in token && token.$type === 'lineHeight';
};

export const walkLineHeights = (root: unknown, callback: (token: LineHeightToken, path: string[]) => void): void => {
  walkObject<LineHeightToken>(root, isLineHeightToken, callback);
};

const isDimensionToken = (token: unknown): token is DimensionToken => {
  return isTokenLike(token) && DimensionTokenSchema.safeParse(token).success;
};

export const walkDimensions = (root: unknown, callback: (token: DimensionToken, path: string[]) => void): void => {
  walkObject<DimensionToken>(root, isDimensionToken, (token, path) => {
    const dimension = DimensionTokenSchema.safeParse(token);
    callback(dimension.data!, path);
  });
};
