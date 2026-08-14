import { describe, expect, it } from 'vitest';
import type { BaseDesignToken } from './tokens/base-token';
import { addTokenPathExtensions, EXTENSION_TOKEN_PATH } from './token-path';

describe('addTokenPathExtensions', () => {
  it('sets the dot path of a top-level token', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const tokens = { primary };

    addTokenPathExtensions(tokens);

    expect(primary.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('primary');
  });

  it('sets the full path of a nested token', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const tokens = { brand: { primary } };

    addTokenPathExtensions(tokens);

    expect(primary.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('brand.primary');
  });

  it('sets a path for every token in the tree', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const secondary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 1, 0] } };
    const background: BaseDesignToken = { $type: 'color', $value: '{brand.primary}' };
    const tokens = {
      brand: { primary, secondary },
      button: { background },
    };

    addTokenPathExtensions(tokens);

    expect(primary.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('brand.primary');
    expect(secondary.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('brand.secondary');
    expect(background.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('button.background');
  });

  it('overwrites an existing path extension', () => {
    const primary: BaseDesignToken = {
      $extensions: { [EXTENSION_TOKEN_PATH]: 'old.path' },
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [1, 0, 0] },
    };
    const tokens = { brand: { primary } };

    addTokenPathExtensions(tokens);

    expect(primary.$extensions?.[EXTENSION_TOKEN_PATH]).toBe('brand.primary');
  });

  it('mutates and returns the same input object', () => {
    const tokens = {
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
    };

    const result = addTokenPathExtensions(tokens);

    expect(result).toBe(tokens);
  });

  it('does nothing for a theme without tokens', () => {
    const tokens = { brand: {} };

    const result = addTokenPathExtensions(tokens);

    expect(result).toEqual({ brand: {} });
  });
});
