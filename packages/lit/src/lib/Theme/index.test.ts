import tokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import { describe, expect, test } from 'vitest';
import Theme from './index';

describe('Theme', () => {
  test('instantiates with default values', () => {
    const theme = new Theme();
    expect(theme.defaults).toMatchObject(Theme.defaults);
  });

  test('can instantiate with custom defaults', () => {
    const theme = new Theme(tokens);
    expect(theme.defaults).toMatchObject(tokens);
  });

  test('can update tokens', async () => {
    const theme = new Theme();
    const initialTokens = structuredClone(theme.tokens);
    theme.tokens = tokens;
    const updatedTokens = structuredClone(theme.tokens);
    return expect(updatedTokens).not.toMatchObject(initialTokens);
  });

  test('can reset tokens', async () => {
    const theme = new Theme();
    theme.tokens = tokens;
    const updatedTokens = structuredClone(theme.tokens);
    theme.reset();
    const resettedTokens = structuredClone(theme.tokens);
    return expect(resettedTokens).not.toMatchObject(updatedTokens);
  });

  test('can export to css custom properties', async () => {
    const theme = new Theme();
    const css = await theme.toCSS();
    return expect(css).toMatchSnapshot();
  });

  test('can export to resolved css custom properties', async () => {
    const theme = new Theme();
    const css = await theme.toCSS({ resolved: true });
    expect(css).toMatchSnapshot();
  });
});
