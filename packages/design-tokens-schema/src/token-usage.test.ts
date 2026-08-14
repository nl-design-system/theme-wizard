import { describe, expect, it } from 'vitest';
import type { BaseDesignToken } from './tokens/base-token';
import {
  countUsagePerToken,
  addTokenCountExtensions,
  EXTENSION_REFERENCED_AT,
  EXTENSION_REFERENCE_COUNT,
} from './token-usage';

describe('countUsagePerToken', () => {
  it('maps a referenced token id to the path of its referencer', () => {
    const tokens = {
      alias: { $type: 'color', $value: '{brand.primary}' },
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
    };

    const usage = countUsagePerToken(tokens);

    expect(usage.get('brand.primary')).toEqual(['alias']);
  });

  it('collects paths from multiple tokens referencing the same token', () => {
    const tokens = {
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
      button: {
        background: { $type: 'color', $value: '{brand.primary}' },
      },
      link: {
        color: { $type: 'color', $value: '{brand.primary}' },
      },
    };

    const usage = countUsagePerToken(tokens);

    expect(usage.get('brand.primary')).toEqual(['button.background', 'link.color']);
  });

  it('does not include tokens that are never referenced', () => {
    const tokens = {
      alias: { $type: 'color', $value: '{brand.primary}' },
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
        secondary: { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 1, 0] } },
      },
    };

    const usage = countUsagePerToken(tokens);

    expect(usage.has('brand.secondary')).toBe(false);
  });

  it('ignores refs that live inside $extensions', () => {
    const tokens = {
      alias: {
        $extensions: {
          shadow: { $type: 'color', $value: '{brand.primary}' },
        },
        $type: 'color',
        $value: { colorSpace: 'srgb', components: [1, 0, 0] },
      },
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
    };

    const usage = countUsagePerToken(tokens);

    expect(usage.has('brand.primary')).toBe(false);
  });

  it('returns an empty map when there are no refs', () => {
    const tokens = {
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
    };

    const usage = countUsagePerToken(tokens);

    expect(usage.size).toBe(0);
  });
});

describe('addTokenCountExtensions', () => {
  it('adds referenced-in and reference-count extensions to a referenced token', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const tokens = {
      alias: { $type: 'color', $value: '{brand.primary}' },
      brand: { primary },
    };

    addTokenCountExtensions(tokens);

    expect(primary.$extensions).toEqual({
      [EXTENSION_REFERENCE_COUNT]: 1,
      [EXTENSION_REFERENCED_AT]: ['alias'],
    });
  });

  it('sums up all referencing paths for reference-count', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const tokens = {
      brand: { primary },
      button: {
        background: { $type: 'color', $value: '{brand.primary}' },
      },
      link: {
        color: { $type: 'color', $value: '{brand.primary}' },
      },
    };

    addTokenCountExtensions(tokens);

    expect(primary.$extensions?.[EXTENSION_REFERENCE_COUNT]).toBe(2);
    expect(primary.$extensions?.[EXTENSION_REFERENCED_AT]).toEqual(['button.background', 'link.color']);
  });

  it('leaves unreferenced tokens without extensions', () => {
    const primary: BaseDesignToken = { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } };
    const tokens = { brand: { primary } };

    addTokenCountExtensions(tokens);

    expect(primary.$extensions).toBeUndefined();
  });

  it('mutates and returns the same input object', () => {
    const tokens = {
      alias: { $type: 'color', $value: '{brand.primary}' },
      brand: {
        primary: { $type: 'color', $value: { colorSpace: 'srgb', components: [1, 0, 0] } },
      },
    };

    const result = addTokenCountExtensions(tokens);

    expect(result).toBe(tokens);
  });
});
