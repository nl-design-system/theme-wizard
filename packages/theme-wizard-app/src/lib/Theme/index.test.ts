import { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import themeTokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import { is_declaration, is_rule, parse as parseCss } from '@projectwallace/css-parser';
import dlv from 'dlv';
import { describe, expect, it } from 'vitest';
import Theme from './index';

const tokens = themeTokens as unknown as TokenGroup;

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

  it('adds token path extensions when loading tokens', () => {
    const theme = new Theme();
    const strippedTokens = JSON.parse(
      JSON.stringify(theme.tokens, (key, value) => (key === '$extensions' ? undefined : value)),
    );
    theme.load(strippedTokens);
    expect(dlv(theme.tokens, 'basis.color.default.bg-document.$extensions')).toMatchObject({
      'nl.nldesignsystem.path': 'basis.color.default.bg-document',
    });
  });

  it('can update token at a specific path', async () => {
    const theme = new Theme();
    const initialTokens = structuredClone(theme.tokens);
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedTokens = structuredClone(theme.tokens);
    return expect(updatedTokens).not.toMatchObject(initialTokens);
  });

  it('can apply tokens, including tokens it does not have yet', () => {
    const theme = new Theme();
    const newHoverValue = '{basis.color.accent-1.bg-active}';
    expect(dlv(theme.tokens, 'ams.page-header.background-color.$value')).toBeUndefined();
    expect(dlv(theme.tokens, 'basis.color.accent-1.color-hover.$value')).not.toBe(newHoverValue);
    expect(theme.modified).toBe(false);

    // Do the update
    theme.applyTokens({
      ams: { 'page-header': { 'background-color': { $type: 'color', $value: '{basis.color.accent-1.bg-document}' } } },
      basis: {
        color: { 'accent-1': { 'color-hover': { $type: 'color', $value: newHoverValue } } },
      },
    });
    expect(dlv(theme.tokens, 'ams.page-header.background-color.$value')).toBe('{basis.color.accent-1.bg-document}');
    expect(dlv(theme.tokens, 'basis.color.accent-1.color-hover.$value')).toBe(newHoverValue);
    expect(theme.modified).toBe(true);
  });

  it('has a different CSS output after token update', async () => {
    const theme = new Theme();
    const initialCSS = normalizeCss(await theme.toCSS());
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const updatedCSS = normalizeCss(await theme.toCSS());
    expect(updatedCSS).toMatchSnapshot();
    return expect(initialCSS).not.toMatch(updatedCSS);
  });

  it('clones without resetting state or stylesheet', () => {
    const theme = new Theme();
    theme.updateAt('basis.color.accent-1.color-hover', '{basis.color.accent-1.bg-active}');
    const css = theme.css;
    const cloned = theme.clone();
    expect(cloned).not.toBe(theme);
    expect(cloned.tokens).toBe(theme.tokens);
    expect(cloned.modified).toBe(theme.modified);
    expect(cloned.issues).toEqual(theme.issues);
    expect(cloned.stylesheet).toBe(theme.stylesheet);
    expect(cloned.css).toBe(css);
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

  it('groups contrast issues on coupled and referencing tokens into a single group', () => {
    const theme = new Theme();
    // Same value as basis.color.default.bg-default (#f1f1f1), so the pair fails contrast
    theme.updateAt('basis.color.default.color-default', '#f1f1f1');

    const contrastIssues = theme.issues.filter((issue) => issue.code === 'insufficient_contrast');
    // The failing pair emits two issues, and every token referencing the pair emits its own
    expect(contrastIssues.length).toBeGreaterThan(2);
    expect(theme.errorCount).toBe(theme.issues.length);

    const contrastGroups = theme.groupedIssues.filter((group) => group.code === 'insufficient_contrast');
    expect(contrastGroups).toHaveLength(1);
    expect(contrastGroups[0].issues).toHaveLength(contrastIssues.length);
    // The representative points at the root cause, not at a referencing token
    expect(contrastGroups[0].representative.path).toBe('basis.color.default.color-default');
  });

  it('invalidates grouped issues when tokens change', () => {
    const theme = new Theme();
    theme.updateAt('basis.color.default.color-default', '#f1f1f1');
    const failingGroups = theme.groupedIssues;
    expect(failingGroups.some((group) => group.code === 'insufficient_contrast')).toBe(true);

    theme.resetAt('basis.color.default.color-default');
    expect(theme.groupedIssues.some((group) => group.code === 'insufficient_contrast')).toBe(false);
  });
});
