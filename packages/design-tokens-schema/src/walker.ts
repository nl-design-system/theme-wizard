import { BaseDesignToken } from './tokens/base-token';
import { ColorToken } from './tokens/color-token';
import { DimensionToken, DimensionTokenSchema } from './tokens/dimension-token';
import { isRef, isTokenLike, isTokenWithRef, isValueObject, type TokenWithRefLike } from './tokens/token-reference';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';

/** Return from a walkObject/walkTokens callback to skip recursing into children */
export const SKIP = Symbol('skip');

/**
 * @param root The object you want to traverse
 * @param predicate Predicate function that returns true when data is a <T>-shape object
 * @param callback Is called whenever the predicate returns true. Return SKIP to stop recursing into children.
 */
export const walkObject = <T = unknown>(
  root: unknown,
  predicate: (data: unknown, path: string[]) => data is T,
  callback?: (data: T, path: string[]) => void | typeof SKIP,
): void => {
  const visited = new WeakSet();

  function traverse(currentData: unknown, path: string[]): void {
    // Check if current data matches
    if (predicate(currentData, path)) {
      if (callback?.(currentData, path) === SKIP) return;
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

export const isColorToken = (token: unknown): token is ColorToken => {
  if (!isValueObject(token)) return false;
  return (
    Object.hasOwn(token, '$type') &&
    token['$type'] === 'color' &&
    Object.hasOwn(token, '$value') &&
    (isRef(token['$value']) || isValueObject(token['$value']))
  );
};

export const walkColors = (root: unknown, callback: (token: ColorToken, path: string[]) => void | typeof SKIP): void => {
  walkObject<ColorToken>(root, isColorToken, callback);
};

export const walkTokensWithRef = (
  root: unknown,
  config: Record<string, unknown>,
  callback: (token: TokenWithRefLike, path: string[]) => void | typeof SKIP,
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

const isLineHeightToken = (token: unknown): token is BaseDesignToken => {
  return isTokenLike(token) && token['$extensions']?.[EXTENSION_TOKEN_SUBTYPE] === 'line-height';
};

export const walkLineHeights = (root: unknown, callback: (token: BaseDesignToken, path: string[]) => void | typeof SKIP): void => {
  walkObject<BaseDesignToken>(root, isLineHeightToken, callback);
};

const isDimensionToken = (token: unknown): token is DimensionToken => {
  return isTokenLike(token) && DimensionTokenSchema.safeParse(token).success;
};

export const walkDimensions = (root: unknown, callback: (token: DimensionToken, path: string[]) => void | typeof SKIP): void => {
  walkObject<DimensionToken>(root, isDimensionToken, (token, path) => {
    const dimension = DimensionTokenSchema.safeParse(token);
    return callback(dimension.data!, path);
  });
};

export const walkTokens = (root: unknown, callback: (token: BaseDesignToken, path: string[]) => void | typeof SKIP): void => {
  walkObject<BaseDesignToken>(root, isTokenLike, callback);
};
