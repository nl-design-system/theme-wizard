import {
  BaseDesignToken,
  BaseDesignTokenIdentifier,
  isTokenLike,
  isValueObject,
  type TokenGroup,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';

export const tokenPathToCSSCustomProperty = (tokenPath: BaseDesignTokenIdentifier[]): string =>
  '--' + tokenPath.join('-');

export const flattenTokens = (
  tokens: Record<string, unknown>,
  basePath: string = '',
  accumulator: Record<string, BaseDesignToken> = Object.create(null),
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
 * Converts token values to a style object of CSS custom properties.
 * Example: `{ nl: { button: { color: { $value: '{basis.color.default.color-default}' } } } }`
 * becomes `{ '--nl-button-color': 'var(--basis-color-default-color-default)' }`.
 */
export const tokensToStyle = (tokens: TokenGroup) => {
  const style: { [index: string]: string } = {};

  walkTokens(tokens, (token, path) => {
    if (typeof token.$value === 'string') {
      const cssProperty = tokenPathToCSSCustomProperty(path);
      const cssValue = refToCssVariable(token.$value);
      style[cssProperty] = cssValue;
    }
  });

  return style;
};
