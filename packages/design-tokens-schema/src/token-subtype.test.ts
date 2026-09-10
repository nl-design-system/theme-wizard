import dlv from 'dlv';
import { dset } from 'dset';
import { it, describe, expect } from 'vitest';
import type { BaseDesignToken } from './tokens/base-token';
import {
  EXTENSION_TOKEN_SUBTYPE,
  setDimensionSubtype,
  setNumberSubtype,
  setColorSubtype,
  setLineHeightSubtype,
  getTokenSubtype,
  addTokenSubTypeExtensions,
  DimensionSubtypeSchema,
  NumberSubtypeSchema,
  ColorSubtypeSchema,
  TokenSubtypeSchema,
} from './token-subtype';

const dimensionToken: BaseDesignToken = {
  $type: 'dimension',
  $value: { unit: 'px', value: 16 },
};

const numberToken: BaseDesignToken = { $type: 'number', $value: 1.5 };

const colorToken: BaseDesignToken = {
  $type: 'color',
  $value: { colorSpace: 'srgb', components: [0, 0, 0] },
};

describe('setDimensionSubtype', () => {
  it('sets the subtype extension on a dimension token', () => {
    const token = { ...dimensionToken };
    setDimensionSubtype(token, 'font-size');
    expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toBe('font-size');
  });

  it('is a no-op when the token is not a dimension token', () => {
    const token = { ...colorToken };
    setDimensionSubtype(token, 'font-size');
    expect(token.$extensions).toBeUndefined();
  });
});

describe('setNumberSubtype', () => {
  it('sets the subtype extension on a number token', () => {
    const token = { ...numberToken };
    setNumberSubtype(token, 'font-weight');
    expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toBe('font-weight');
  });

  it('is a no-op when the token is not a number token', () => {
    const token = { ...dimensionToken };
    setNumberSubtype(token, 'font-weight');
    expect(token.$extensions).toBeUndefined();
  });
});

describe('setColorSubtype', () => {
  it('sets the subtype extension on a color token', () => {
    const token = { ...colorToken };
    setColorSubtype(token, 'background-color');
    expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toBe('background-color');
  });

  it('is a no-op when the token is not a color token', () => {
    const token = { ...dimensionToken };
    setColorSubtype(token, 'background-color');
    expect(token.$extensions).toBeUndefined();
  });
});

describe('setLineHeightSubtype', () => {
  it('sets line-height on a dimension token', () => {
    const token = { ...dimensionToken };
    setLineHeightSubtype(token);
    expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toBe('line-height');
  });

  it('sets line-height on a number token', () => {
    const token = { ...numberToken };
    setLineHeightSubtype(token);
    expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toBe('line-height');
  });

  it('is a no-op when the token is neither dimension nor number', () => {
    const token = { ...colorToken };
    setLineHeightSubtype(token);
    expect(token.$extensions).toBeUndefined();
  });
});

describe('getTokenSubtype', () => {
  it('returns the subtype when it is a known value', () => {
    const token: BaseDesignToken = {
      ...dimensionToken,
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'space-block' },
    };
    expect(getTokenSubtype(token)).toBe('space-block');
  });

  it('returns undefined when no extensions are set', () => {
    expect(getTokenSubtype(dimensionToken)).toBeUndefined();
  });

  it('returns undefined when the subtype extension is absent but others are set', () => {
    const token: BaseDesignToken = {
      ...dimensionToken,
      $extensions: { 'nl.nldesignsystem.path': 'basis.font.size.md' },
    };
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it('returns undefined for an unknown/garbage subtype value instead of trusting it', () => {
    const token: BaseDesignToken = {
      ...dimensionToken,
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'not-a-real-subtype' },
    };
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it('returns undefined when the subtype is valid for a different $type (e.g. font-size on a color token)', () => {
    const token: BaseDesignToken = {
      ...colorToken,
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'font-size' },
    };
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it('returns undefined for a $type that never has a sub-type (e.g. fontFamily)', () => {
    const token: BaseDesignToken = {
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'color' },
      $type: 'fontFamily',
      $value: 'Arial',
    };
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it('returns undefined when the subtype value is not a string', () => {
    const token: BaseDesignToken = {
      ...dimensionToken,
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 42 },
    };
    expect(getTokenSubtype(token)).toBeUndefined();
  });
});

describe('DimensionSubtypeSchema', () => {
  it.each([
    'font-size',
    'line-height',
    'space-block',
    'space-inline',
    'space-column',
    'space-row',
    'space-text',
    'border-radius',
    'border-width',
    'size',
  ])('accepts %s', (value) => {
    expect(DimensionSubtypeSchema.safeParse(value).success).toBe(true);
  });

  it('rejects a color subtype', () => {
    expect(DimensionSubtypeSchema.safeParse('background-color').success).toBe(false);
  });
});

describe('NumberSubtypeSchema', () => {
  it.each(['line-height', 'font-weight'])('accepts %s', (value) => {
    expect(NumberSubtypeSchema.safeParse(value).success).toBe(true);
  });

  it('rejects a dimension-only subtype', () => {
    expect(NumberSubtypeSchema.safeParse('space-block').success).toBe(false);
  });
});

describe('ColorSubtypeSchema', () => {
  it.each(['background-color', 'border-color', 'color'])('accepts %s', (value) => {
    expect(ColorSubtypeSchema.safeParse(value).success).toBe(true);
  });

  it('rejects a dimension subtype', () => {
    expect(ColorSubtypeSchema.safeParse('font-size').success).toBe(false);
  });
});

describe('TokenSubtypeSchema', () => {
  it('accepts any valid subtype across all token types', () => {
    for (const value of ['font-size', 'font-weight', 'color']) {
      expect(TokenSubtypeSchema.safeParse(value).success).toBe(true);
    }
  });

  it('rejects an unknown value', () => {
    expect(TokenSubtypeSchema.safeParse('unknown-subtype').success).toBe(false);
  });
});

describe('addTokenSubTypeExtensions', () => {
  it.each([
    ['basis.text.font-size.md', 'font-size'],
    ['basis.text.line-height.md', 'line-height'],
    ['basis.margin-block.md', 'space-block'],
    ['basis.padding-block.md', 'space-block'],
    ['basis.space.block.md', 'space-block'],
    ['basis.margin-inline.md', 'space-inline'],
    ['basis.padding-inline.md', 'space-inline'],
    ['basis.space.inline.md', 'space-inline'],
    ['basis.column-gap.md', 'space-column'],
    ['basis.space.column.md', 'space-column'],
    ['basis.row-gap.md', 'space-row'],
    ['basis.space.row.md', 'space-row'],
    ['basis.space.text.md', 'space-text'],
    ['basis.border-radius.md', 'border-radius'],
    ['basis.border-inline-width.md', 'border-width'],
    ['basis.icon.size.md', 'size'],
  ])('sets dimension sub-type for path "%s" to "%s"', (path, expected) => {
    const config = {};
    dset(config, path, { $type: 'dimension', $value: { unit: 'px', value: 16 } });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, path) as BaseDesignToken;
    expect(getTokenSubtype(token)).toBe(expected);
  });

  it('leaves a dimension token untouched when its path matches no known pattern', () => {
    const config = {};
    dset(config, 'basis.unrelated.md', { $type: 'dimension', $value: { unit: 'px', value: 16 } });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, 'basis.unrelated.md') as BaseDesignToken;
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it.each([
    ['basis.color.default.bg-default', 'background-color'],
    ['nl.button.background-color', 'background-color'],
    ['basis.color.default.border-default', 'border-color'],
    ['nl.button.color-default', 'color'],
    ['nl.button.color', 'color'],
  ])('sets color sub-type for path "%s" to "%s"', (path, expected) => {
    const config = {};
    dset(config, path, { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 0, 0] } });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, path) as BaseDesignToken;
    expect(getTokenSubtype(token)).toBe(expected);
  });

  it('leaves a color token untouched when its path matches no known pattern', () => {
    const config = {};
    dset(config, 'basis.unrelated.md', { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 0, 0] } });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, 'basis.unrelated.md') as BaseDesignToken;
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it.each([
    ['nl.button.line-height', 'line-height'],
    ['nl.button.font-weight', 'font-weight'],
  ])('sets number sub-type for path "%s" to "%s"', (path, expected) => {
    const config = {};
    dset(config, path, { $type: 'number', $value: 1.5 });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, path) as BaseDesignToken;
    expect(getTokenSubtype(token)).toBe(expected);
  });

  it('leaves a number token untouched when its path matches no known pattern', () => {
    const config = {};
    dset(config, 'nl.button.unrelated', { $type: 'number', $value: 1.5 });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, 'nl.button.unrelated') as BaseDesignToken;
    expect(getTokenSubtype(token)).toBeUndefined();
  });

  it('does not touch tokens whose $type has no sub-type concept (e.g. fontFamily)', () => {
    const config = {};
    dset(config, 'nl.button.font-family', { $type: 'fontFamily', $value: 'Arial' });

    addTokenSubTypeExtensions(config);

    const token = dlv(config, 'nl.button.font-family') as BaseDesignToken;
    expect(token.$extensions).toBeUndefined();
  });

  it('returns the same (mutated) rootConfig it was given', () => {
    const config = {};
    dset(config, 'nl.button.size', { $type: 'dimension', $value: { unit: 'px', value: 16 } });

    const result = addTokenSubTypeExtensions(config);

    expect(result).toBe(config);
  });
});
