import { SKIP, stringifyToken, type TokenGroup, walkTokens } from '@nl-design-system-community/design-tokens-schema';
import { tokenPathToCSSCustomProperty } from '../lib/tokens';

const STRINGIFIABLE_TYPES = new Set(['color', 'dimension', 'fontFamily', 'number']);

// Replaces `{a.b.c}` token references with `var(--a-b-c)`.
export const refToCSSVariable = (value: string): string =>
  value.replaceAll(/\{([^{}]+)\}/g, (_, tokenName: string) => `var(--${tokenName.replaceAll('.', '-')})`);

export const createThemeStylesheet = (tokens: TokenGroup, selector = ':host'): string => {
  const declarations: string[] = [];

  walkTokens(tokens, (token, path) => {
    let value = token.$value;

    if (typeof value !== 'string' && typeof value !== 'number' && STRINGIFIABLE_TYPES.has(token.$type)) {
      value = stringifyToken(token);
    }

    if (typeof value === 'string' || typeof value === 'number') {
      declarations.push(`${tokenPathToCSSCustomProperty(path)}: ${refToCSSVariable(value.toString())};`);
    }

    // Token values don't contain further nested tokens.
    return SKIP;
  });

  return `${selector} { ${declarations.join('\n')} }`;
};
