import { describe, it, expect, expectTypeOf } from 'vitest';
import { StrictThemeSchema } from '../theme';
import {
  type FontFamilyValue,
  ModernFontFamilyValueSchema,
  FontFamilyTokenSchema,
  FontFamilyToken,
  legacyToModernFontFamily,
} from './fontfamily-token';

describe('parsing values', () => {
  it('accepts valid font-families', () => {
    const fixtures = ['serif', '💪', 'Arial Black', '-apple-system'];
    for (const fontFamily of fixtures) {
      const result = ModernFontFamilyValueSchema.safeParse(fontFamily);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<FontFamilyValue>();
    }
  });

  it('modern format accepts arrays', () => {
    const result = ModernFontFamilyValueSchema.safeParse(['serif', 'sans-serif']);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(['serif', 'sans-serif']);
    expectTypeOf(result.data!).toEqualTypeOf<FontFamilyValue>();
  });

  it('rejects invalid "families"', () => {
    for (const nonFamily of [16, true, ' ', ',', ' , ']) {
      const result = ModernFontFamilyValueSchema.safeParse(nonFamily);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<FontFamilyValue>();
    }
  });
});

it('accepts modern token', () => {
  const token = {
    $type: 'fontFamily',
    $value: ['sans-serif'],
  };
  const result = FontFamilyTokenSchema.safeParse(token);
  expect.soft(result.success).toBeTruthy();
  expectTypeOf(result.data!).toEqualTypeOf<FontFamilyToken>();
  expect.soft(result.data).toEqual(token);
});

describe('legacy token format preprocessing (via theme schema)', () => {
  it('upgrades legacy fontFamilies token', () => {
    const config = {
      basis: {
        heading: {
          'font-family': {
            $type: 'fontFamilies',
            $value: 'Source Sans Pro, Helvetica, Arial, sans-serif',
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBeTruthy();
    const token = (result.data as any)?.basis?.heading?.['font-family'];
    expect(token?.$type).toEqual('fontFamily');
    expect(token?.$value).toEqual(['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif']);
  });

  it('upgrades fontFamily token with legacy string value', () => {
    const config = {
      basis: {
        heading: {
          'font-family': {
            $type: 'fontFamily',
            $value: 'IBM Plex Sans, monospace',
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBeTruthy();
    const token = (result.data as any)?.basis?.heading?.['font-family'];
    expect(token?.$type).toEqual('fontFamily');
    expect(token?.$value).toEqual(['IBM Plex Sans', 'monospace']);
  });
});

describe('encode/decode value', () => {
  it('stringify array to CSS font-family declaration and back', () => {
    const token = {
      $type: 'fontFamily',
      $value: ['IBM Plex Sans', 'Helvetica'],
    };
    const expected = '"IBM Plex Sans","Helvetica"';
    const encodeResult = legacyToModernFontFamily.encode(token.$value);
    expect.soft(encodeResult).toBe(expected);
    const decodeResult = legacyToModernFontFamily.decode(encodeResult);
    expect.soft(decodeResult).toEqual(token.$value);
  });

  it('omit quotation marks for generic font name', () => {
    const token = {
      $type: 'fontFamily',
      $value: ['IBM Plex Sans', 'sans-serif'],
    };
    const expected = '"IBM Plex Sans",sans-serif';
    const encodeResult = legacyToModernFontFamily.encode(token.$value);
    expect.soft(encodeResult).toBe(expected);
    const decodeResult = legacyToModernFontFamily.decode(encodeResult);
    expect.soft(decodeResult).toEqual(token.$value);
  });

  it('leave string as is', () => {
    const token = {
      $type: 'fontFamily',
      $value: 'sans-serif',
    };
    const expected = 'sans-serif';
    const encodeResult = legacyToModernFontFamily.encode(token.$value);
    expect.soft(encodeResult).toBe(expected);
    const decodeResult = legacyToModernFontFamily.decode(encodeResult);
    expect.soft(decodeResult).toBe(expected);
  });
});
