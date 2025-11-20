import tokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import { describe, expect, it } from 'vitest';
import Theme from './index';

describe('Theme', () => {
  it('instantiates with default values', () => {
    const theme = new Theme();
    expect(theme.defaults).toMatchObject(Theme.defaults);
  });

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

  it('can reset tokens', async () => {
    const theme = new Theme();
    theme.tokens = tokens;
    const updatedTokens = structuredClone(theme.tokens);
    theme.reset();
    const resettedTokens = structuredClone(theme.tokens);
    return expect(resettedTokens).not.toMatchObject(updatedTokens);
  });

  it('can export to css custom properties', async () => {
    const theme = new Theme();
    const css = await theme.toCSS();
    return expect(css).toMatchSnapshot();
  });

  it('can export to resolved css custom properties', async () => {
    const theme = new Theme();
    const css = await theme.toCSS({ resolved: true });
    expect(css).toMatchSnapshot();
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
