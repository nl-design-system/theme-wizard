import type { TokenGroup } from '@nl-design-system-community/clippy-components/clippy-reset-theme';
import {
  BaseDesignToken,
  BaseDesignTokenIdentifier,
  isTokenLike,
  isValueObject,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';

export const tokenPathToCSSCustomProperty = (tokenPath: BaseDesignTokenIdentifier[]): string =>
  '--' + tokenPath.join('-');

export const flattenTokens = (
  tokens: Record<string, unknown>,
  basePath: string = '',
  accumulator: Record<string, BaseDesignToken> = {},
): Record<string, BaseDesignToken> => {
  for (const [key, token] of Object.entries(tokens)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isTokenLike(token)) {
      accumulator[path] = token;
    } else if (isValueObject(token)) {
      flattenTokens(token, path, accumulator);
    }
  }

  return accumulator;
};

/**
 * Replace `{example.component.property}` with `var(--example-component-property)`
 */
export const refToCssVariable = (value: string): string =>
  value.replaceAll(/\{([^{}]+)\}/g, (_, tokenName) => {
    return `var(--${tokenName.replaceAll('.', '-')})`;
  });

/**
 * Flattens preset token values into `{ path, value }` updates.
 * Unlike `walkTokens`, this also handles tokens that only specify `$value` without `$type`.
 */
export const presetTokensToUpdateMany = (
  tokens: unknown,
  basePath = '',
): { path: string; value: BaseDesignToken['$value'] }[] => {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) return [];

  const obj = tokens as Record<string, unknown>;

  if (Object.hasOwn(obj, '$value')) {
    const result = { path: basePath, value: obj['$value'] };
    return [result];
  }

  return Object.entries(obj).flatMap(([key, value]) =>
    presetTokensToUpdateMany(value, basePath ? `${basePath}.${key}` : key),
  );
};

/**
 * Converts token values to a style object of CSS custom properties.
 * Example: `{ nl: { button: { color: { $value: '{basis.color.default.color-default}' } } } }`
 * becomes `{ '--nl-button-color': 'var(--basis-color-default-color-default)' }`.
 */
export const tokensToStyle = (tokens: TokenGroup) => {
  const style: { [index: string]: string } = {};

  walkTokens(tokens, (token, path) => {
    if (typeof token.$value === 'string') {
      const cssProperty = `--${path.join('-')}`;
      const cssValue = refToCssVariable(token.$value);
      style[cssProperty] = cssValue;
    }
  });

  return style;
};
