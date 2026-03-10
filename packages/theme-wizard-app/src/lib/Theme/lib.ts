import { BaseDesignTokenIdentifier, isTokenLike, walkTokens } from '@nl-design-system-community/design-tokens-schema';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
import { TokenGroup } from '../../components/wizard-reset-theme/reset-css';

export const tokenPathToCSSCustomProperty = (tokenPath: BaseDesignTokenIdentifier[]): string =>
  '--' + tokenPath.join('-');

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

/**
 * Replace `{example.component.property}` with `var(--example-component-property)`
 */
export const refToCssVariable = (value: string): string =>
  value.replaceAll(/\{([^}]+)\}/g, (_, tokenName) => {
    return `var(--${tokenName.replaceAll('.', '-')})`;
  });

export const tokensToUpdateMany = (tokens: TokenGroup) => {
  const updateMany: { path: string; value: DesignToken['$value'] }[] = [];

  walkTokens(tokens, (token, currentPath) => {
    const path = currentPath.join('.');
    const value = token.$value;

    updateMany.push({ path, value });
  });

  return updateMany;
};

/**
 * Replace `{example.component.property}` with `var(--example-component-property)`
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
