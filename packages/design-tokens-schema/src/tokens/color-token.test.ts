import { describe, it, expect, expectTypeOf } from 'vitest';
import { StrictThemeSchema } from '../theme';
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

  it('using the zod legacyToModernColor codec', () => {
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
