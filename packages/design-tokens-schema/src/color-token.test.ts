import { describe, test, expect, expectTypeOf } from 'vitest';
import {
  ColorAlphaSchema,
  type ColorAlpha,
  type ColorHexFallback,
  ColorHexFallbackSchema,
  ColorTokenValidationSchema,
  ColorValue,
  ColorToken,
  stringifyColor,
  legacyToModernColor,
} from './color-token';

describe('Alpha', () => {
  test('accepts valid ranges', () => {
    for (const alpha of [0, 1, 0.5]) {
      const result = ColorAlphaSchema.safeParse(alpha);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<ColorAlpha>();
    }
  });

  test('rejects invalid ranges', () => {
    for (const alpha of ['0', -1, 2]) {
      const result = ColorAlphaSchema.safeParse(alpha);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<ColorAlpha>();
    }
  });
});

describe('Hex fallback', () => {
  test('accepts valid ranges', () => {
    for (const hex of ['#000000', '#ffffff', '#bada55', '#FFFFFF', '#ffFFff']) {
      const result = ColorHexFallbackSchema.safeParse(hex);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<ColorHexFallback>();
    }
  });

  test('rejects invalid ranges', () => {
    for (const hex of ['000000', '#000', '#aabbccdd', '#az09AZ']) {
      const result = ColorHexFallbackSchema.safeParse(hex);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<ColorHexFallback>();
    }
  });
});

describe('color token validation', () => {
  test('leave valid modern tokens intact', () => {
    const token = {
      $type: 'color',
      $value: {
        alpha: 1,
        colorSpace: 'srgb',
        components: [1, 0, 0],
      },
    } satisfies ColorToken;
    const result = ColorTokenValidationSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  test('upgrade legacy color to modern', () => {
    const legacyColor = {
      $type: 'color',
      $value: '#f00',
    };
    const result = ColorTokenValidationSchema.safeParse(legacyColor);

    expect(result.success).toBeTruthy();
    expect(result.data).toEqual({
      $type: 'color',
      $value: {
        alpha: 1,
        colorSpace: 'srgb',
        components: [1, 0, 0],
      },
    } satisfies ColorToken);
  });

  test('convert `transparent` to fully transparent black, modern syntax', () => {
    const transparentColor = {
      $type: 'color',
      $value: 'transparent',
    };
    const result = ColorTokenValidationSchema.safeParse(transparentColor);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual({
      $type: 'color',
      $value: {
        alpha: 0,
        colorSpace: 'srgb',
        components: [0, 0, 0],
      },
    } satisfies ColorToken);
  });

  test('convert `rgba(0, 0, 0, 0)` to fully transparent black, modern syntax', () => {
    const transparentColor = {
      $type: 'color',
      $value: 'rgba(0, 0, 0, 0)',
    };
    const result = ColorTokenValidationSchema.safeParse(transparentColor);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual({
      $type: 'color',
      $value: {
        alpha: 0,
        colorSpace: 'srgb',
        components: [0, 0, 0],
      },
    } satisfies ColorToken);
  });

  test('invalid colors are rejected', () => {
    const legacyColor = {
      $type: 'color',
      $value: '__not_a_color__',
    };
    const result = ColorTokenValidationSchema.safeParse(legacyColor);
    expect(result.success).toBeFalsy();
  });
});

describe('stringify token to string', () => {
  test('stringify a color value to an srgb string', () => {
    const tokenValue = {
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 0, 0],
    } satisfies ColorValue;
    const result = stringifyColor(tokenValue);
    expect(result).toBe('#ff0000');
  });

  // https://www.designtokens.org/tr/drafts/color/#using-the-none-keyword
  test('stringifies colors that use "none" in their components', () => {
    const tokenValue = {
      alpha: 1,
      colorSpace: 'hsl',
      components: ['none', 0, 100],
      hex: '#ffffff',
    } satisfies ColorValue;
    const result = stringifyColor(tokenValue);
    expect(result).toBe('#ffffff');
  });

  test('using the zod legacyToModernColor codec', () => {
    expect(
      legacyToModernColor.encode({
        alpha: 1,
        colorSpace: 'hsl',
        components: ['none', 0, 100],
        hex: '#ffffff',
      }),
    ).toEqual('#ffffff');
  });
});
