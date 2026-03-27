import Color from 'colorjs.io';
import { describe, it, expect, expectTypeOf } from 'vitest';
import { StrictThemeSchema } from '../theme';
import {
  ColorAlphaSchema,
  type ColorAlpha,
  type ColorHexFallback,
  ColorHexFallbackSchema,
  ColorTokenValidationSchema,
  colorJSToColorValue,
  colorJSToHex,
  ColorValue,
  ColorToken,
  stringifyColor,
} from './color-token';

describe('Alpha', () => {
  it('accepts valid ranges', () => {
    for (const alpha of [0, 1, 0.5]) {
      const result = ColorAlphaSchema.safeParse(alpha);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<ColorAlpha>();
    }
  });

  it('rejects invalid ranges', () => {
    for (const alpha of ['0', -1, 2]) {
      const result = ColorAlphaSchema.safeParse(alpha);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<ColorAlpha>();
    }
  });
});

describe('Hex fallback', () => {
  it('accepts valid ranges', () => {
    for (const hex of ['#000000', '#ffffff', '#bada55', '#FFFFFF', '#ffFFff']) {
      const result = ColorHexFallbackSchema.safeParse(hex);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<ColorHexFallback>();
    }
  });

  it('rejects invalid ranges', () => {
    for (const hex of ['000000', '#000', '#aabbccdd', '#az09AZ']) {
      const result = ColorHexFallbackSchema.safeParse(hex);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<ColorHexFallback>();
    }
  });
});

describe('color token validation', () => {
  it('leave valid modern tokens intact', () => {
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

  it('modern color token is valid', () => {
    const modernColor = {
      $type: 'color',
      $value: {
        alpha: 1,
        colorSpace: 'srgb',
        components: [1, 0, 0],
      },
    } satisfies ColorToken;
    const result = ColorTokenValidationSchema.safeParse(modernColor);

    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(modernColor);
  });

  it('invalid colors are rejected', () => {
    const invalidColor = {
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [1, 0] }, // Missing third component
    };
    const result = ColorTokenValidationSchema.safeParse(invalidColor);
    expect(result.success).toBeFalsy();
  });

  describe('legacy color preprocessing (via theme schema)', () => {
    it('upgrade legacy color to modern (via theme)', () => {
      const config = {
        basis: {
          color: {
            'accent-1': {
              'bg-default': {
                $type: 'color',
                $value: '#f00',
              },
            },
          },
        },
      };
      const result = StrictThemeSchema.safeParse(config);

      expect(result.success).toBeTruthy();
      expect(result.data?.basis?.color?.['accent-1']?.['bg-default']?.$value).toEqual({
        alpha: 1,
        colorSpace: 'srgb',
        components: [1, 0, 0],
      });
    });

    it('convert `transparent` to fully transparent black (via theme)', () => {
      const config = {
        basis: {
          color: {
            'accent-1': {
              'bg-default': {
                $type: 'color',
                $value: 'transparent',
              },
            },
          },
        },
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBeTruthy();
      expect(result.data?.basis?.color?.['accent-1']?.['bg-default']?.$value).toEqual({
        alpha: 0,
        colorSpace: 'srgb',
        components: [0, 0, 0],
      });
    });

    it('convert `rgba(0, 0, 0, 0)` to fully transparent black (via theme)', () => {
      const config = {
        basis: {
          color: {
            'accent-1': {
              'bg-default': {
                $type: 'color',
                $value: 'rgba(0, 0, 0, 0)',
              },
            },
          },
        },
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBeTruthy();
      expect(result.data?.basis?.color?.['accent-1']?.['bg-default']?.$value).toEqual({
        alpha: 0,
        colorSpace: 'srgb',
        components: [0, 0, 0],
      });
    });
  });
});

describe('colorJSToColorValue', () => {
  it('converts a Color to a ColorValue', () => {
    const color = new Color({ alpha: 1, coords: [1, 0, 0], spaceId: 'srgb' });
    const result = colorJSToColorValue(color);
    expect(result).toEqual({ alpha: 1, colorSpace: 'srgb', components: [1, 0, 0] });
    expectTypeOf(result).toEqualTypeOf<ColorValue>();
  });

  it('preserves alpha', () => {
    const color = new Color({ alpha: 0.5, coords: [0, 0, 1], spaceId: 'srgb' });
    expect(colorJSToColorValue(color).alpha).toBe(0.5);
  });

  it('preserves colorSpace', () => {
    const color = new Color('oklch(50% 0.2 180)');
    expect(colorJSToColorValue(color).colorSpace).toBe('oklch');
  });
});

describe('colorToHex', () => {
  it('converts an sRGB Color to a 6-digit hex string', () => {
    const color = new Color({ alpha: 1, coords: [1, 0, 0], spaceId: 'srgb' });
    expect(colorJSToHex(color)).toBe('#ff0000');
  });

  it('converts a wide-gamut Color to a clamped hex string', () => {
    const color = new Color('oklch(50% 0.2 180)');
    const result = colorJSToHex(color);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('uses 6-digit hex, not shorthand', () => {
    const color = new Color({ alpha: 1, coords: [0, 0, 0], spaceId: 'srgb' });
    expect(colorJSToHex(color)).toBe('#000000');
  });
});

describe('stringify token to string', () => {
  it('stringify a color value to an srgb string', () => {
    const tokenValue = {
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 0, 0],
    } satisfies ColorValue;
    const result = stringifyColor(tokenValue);
    expect(result).toBe('#ff0000');
  });

  it('accepts a Color object directly, skipping colorTokenValueToColorJS', () => {
    const color = new Color({ alpha: 1, coords: [1, 0, 0], spaceId: 'srgb' });
    expect(stringifyColor(color)).toBe('#ff0000');
  });

  // https://www.designtokens.org/tr/drafts/color/#using-the-none-keyword
  it('stringifies colors that use "none" in their components', () => {
    const tokenValue = {
      alpha: 1,
      colorSpace: 'hsl',
      components: ['none', 0, 100],
      hex: '#ffffff',
    } satisfies ColorValue;
    const result = stringifyColor(tokenValue);
    expect(result).toBe('#ffffff');
  });

  it('stringifies a non-color without throwing', () => {
    const result = stringifyColor(undefined as unknown as ColorValue);
    expect(result).toBe('#0000');
  });
});
