import tokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import { is_declaration, is_rule, parse as parseCss } from '@projectwallace/css-parser';
import dlv from 'dlv';
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
  if (is_rule(rule)) {
    newCss.push(rule?.first_child?.text + ' {');
    rule.block?.children
      .filter((child) => is_declaration(child))
      .toSorted((a, b) => a.property.localeCompare(b.property))
      .forEach((declaration) => {
        newCss.push(`\t${declaration.property}: ${declaration.value?.text}`);
      });
    newCss.push('}');
  }
  return newCss.join('\n');
};

describe('Theme', () => {
  it('can instantiate with custom defaults', () => {
    const theme = new Theme(tokens);
    const defaultTheme = new Theme();
    // The constructor runs the theme processors (upgrading legacy token types, parsing color
    // values, adding extensions, etc.), so `defaults` won't match the raw input tokens
    // verbatim anymore. Instead, assert that the given tokens were actually used: the same
    // set of token paths made it through, and it's not just falling back to the start tokens.
    const inputPaths = Object.keys(Theme.flatten(tokens)).sort();
    const defaultPaths = Object.keys(Theme.flatten(theme.defaults)).sort();
    expect(defaultPaths).toEqual(inputPaths);
    expect(defaultPaths).not.toEqual(Object.keys(Theme.flatten(defaultTheme.defaults)).sort());
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
    const initialTokens = theme.toLegacyTokens();
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');

    const updatedTokens = theme.toLegacyTokens();
    const sourceValue = dlv(updatedTokens, 'basis.color.accent-1.color-hover.$value');
    expect(sourceValue).toBe('{basis.color.accent-1.bg-active}');

    const destinationValue = dlv(updatedTokens, 'basis.color.accent-1.bg-active.$value');
    expect(destinationValue).toBe('#dde6f1');
    return expect(initialTokens).not.toEqual(updatedTokens);
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
    const path = 'basis.color.accent-1.color-hover';
    const initialTokens = structuredClone(theme.tokens);
    theme.updateAt(path, '{basis.color.accent-1.bg-active}');
    theme.resetAt(path);
    const resettedTokens = structuredClone(theme.tokens);
    const initialToken = dlv(initialTokens, path);
    const resettedToken = dlv(resettedTokens, path);
    expect(resettedToken).toMatchObject(initialToken);
  });

  it('can export to css custom properties', async () => {
    const theme = new Theme();
    const css = normalizeCss(await theme.toCSS());
    return expect(css).toMatchSnapshot();
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
