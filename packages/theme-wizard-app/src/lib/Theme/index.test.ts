import tokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import { parse as parseCss } from '@projectwallace/css-parser';
import { describe, expect, it } from 'vitest';
import Theme from './index';

// CSSOM isn't stable in what it returns, so for testing purposes we normalize the CSS
// so that the outcome is predictable.
const normalizeCss = (css: string): string => {
  const ast = parseCss(css, {
    parse_atrule_preludes: false,
    parse_selectors: false,
    parse_values: false,
  });
  const newCss: string[] = [];
  const rule = ast.first_child;
  newCss.push(rule?.first_child?.text + ' {');
  rule?.block?.children
    .toSorted((a, b) => (a.property ?? '').localeCompare(b.property ?? ''))
    .forEach((declaration) => {
      newCss.push(`\t${declaration.property}: ${declaration.value}`);
    });
  newCss.push('}');
  return newCss.join('\n');
};

describe('Theme', () => {
  it('can instantiate with custom defaults', () => {
    const theme = new Theme(tokens);
    expect(theme.defaults).toMatchObject(tokens);
  });

  it('can update tokens', async () => {
    const theme = new Theme();
    const initialTokens = structuredClone(theme.tokens);
    theme.tokens = tokens;
    const updatedTokens = structuredClone(theme.tokens);
    return expect(updatedTokens).not.toMatchObject(initialTokens);
  });

  it('can update token at a specific path', async () => {
    const theme = new Theme();
    const initialTokens = structuredClone(theme.tokens);
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedTokens = structuredClone(theme.tokens);
    return expect(updatedTokens).not.toMatchObject(initialTokens);
  });

  it('has a different CSS output after token update', async () => {
    const theme = new Theme();
    const initialCSS = normalizeCss(await theme.toCSS());
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedCSS = normalizeCss(await theme.toCSS());
    expect(updatedCSS).toMatchSnapshot();
    return expect(initialCSS).not.toMatch(updatedCSS);
  });

  it('has a different JSON output after token update', async () => {
    const theme = new Theme();
    const initialJSON = await theme.toTokensJSON();
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedJSON = await theme.toTokensJSON();
    expect(updatedJSON).toMatchSnapshot();
    return expect(initialJSON).not.toMatch(updatedJSON);
  });

  it('can reset tokens', async () => {
    const theme = new Theme();
    theme.tokens = tokens;
    const updatedTokens = structuredClone(theme.tokens);
    theme.reset();
    const resettedTokens = structuredClone(theme.tokens);
    return expect(resettedTokens).not.toMatchObject(updatedTokens);
  });

  it('can reset token at a specific path', async () => {
    const theme = new Theme();
    const initialTokens = structuredClone(theme.tokens);
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedTokens = structuredClone(theme.tokens);
    expect.soft(updatedTokens).not.toMatchObject(initialTokens);
    theme.resetAt('basis.color.accent-1.color-hover');
    const resettedTokens = structuredClone(theme.tokens);
    expect(resettedTokens).toMatchObject(initialTokens);
  });

  it('can export to css custom properties', async () => {
    const theme = new Theme();
    const css = normalizeCss(await theme.toCSS());
    return expect(css).toMatchSnapshot();
  });

  it('can export to JSON token file', async () => {
    const theme = new Theme();
    const json = await theme.toTokensJSON();
    return expect(json).toMatchSnapshot();
  });

  it('indicates modified state as false on init', () => {
    const theme = new Theme();
    expect(theme.modified).toBe(false);
  });

  it('indicates modified state as true on update', () => {
    const theme = new Theme();
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    expect(theme.modified).toBe(true);
  });

  it('indicates modified state as false on reset', () => {
    const theme = new Theme();
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    theme.reset();
    expect(theme.modified).toBe(false);
  });
});
