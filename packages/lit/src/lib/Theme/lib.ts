import { isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import { DesignToken, DesignTokens } from 'style-dictionary/types';

export const flattenTokens = (
    tokens: DesignTokens,
    basePath: string = '',
    accumulator: [string, DesignToken][] = [],
) => {
  for (const [key, token] of Object.entries(tokens)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isTokenLike(token)) {
      accumulator.push([path, token]);
    } else if (token && typeof token === 'object' && !Array.isArray(token)) {
      flattenTokens(token, path, accumulator);
    }
  }
  return accumulator;
}
