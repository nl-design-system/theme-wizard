import { isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
export const tokenPathToCSSCustomProperty = (tokenPath: TokenPath): string => '--' + tokenPath.join('-');

export const flattenTokens = (
  tokens: DesignTokens,
  basePath: string = '',
  accumulator: Record<string, DesignToken> = {},
): Record<string, DesignToken> => {
  for (const [key, token] of Object.entries(tokens)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isTokenLike(token)) {
      accumulator[path] = token;
    } else if (token && typeof token === 'object' && !Array.isArray(token)) {
      flattenTokens(token as DesignTokens, path, accumulator);
    }
  }

  return accumulator;
};

export type Token = { $value?: string; $type?: string; $extensions?: { [key: string]: unknown } }; //| { $type: unknown };
export type TokenGroup = { $extensions?: { [key: string]: unknown } };
export type TokenNode = { [key: string]: TokenNode | Token } & TokenGroup; //| { $type: unknown };
export type TokenPath = string[];

export function walkTokens(
  obj: TokenNode,
  callback: (path: TokenPath, t: Token) => void,
  partialTokenPath: TokenPath = [],
) {
  if (Object.hasOwn(obj, '$type') || Object.hasOwn(obj, '$value')) {
    callback(partialTokenPath, obj);
  } else {
    Object.keys(obj).flatMap((key) =>
      typeof obj[key] === 'object' && obj[key] !== null
        ? walkTokens(obj[key], callback, [...partialTokenPath, key])
        : [],
    );
  }
}

/**
 * Replace `{example.component.property}` with `var(--example-component-property)`
 */
export const refToCssVariable = (value: string): string =>
  value.replace(/\{([^}]+)\}/g, (_, tokenName) => {
    return `var(--${tokenName.replace(/\./g, '-')})`;
  });
