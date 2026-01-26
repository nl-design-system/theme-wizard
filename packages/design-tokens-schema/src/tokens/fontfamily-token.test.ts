import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  type FontFamilyValue,
  ModernFontFamilyValueSchema,
  LegacyFontFamilyValueSchema,
  type LegacyFontFamilyValue,
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

  it('upgrades legacy format with a single comma-separated string', () => {
    const result = LegacyFontFamilyValueSchema.safeParse('serif, sans-serif');
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(['serif', 'sans-serif']);
    expectTypeOf(result.data!).toEqualTypeOf<LegacyFontFamilyValue>();
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

describe('legacy token format', () => {
  const token = {
    $type: 'fontFamilies',
    $value: 'Source Sans Pro, Helvetica, Arial, sans-serif',
  };

  it('accepts legacy token', () => {
    const result = FontFamilyTokenSchema.safeParse(token);
    expect.soft(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<FontFamilyToken>();
  });

  it('upgrades legacy token', () => {
    const result = FontFamilyTokenSchema.safeParse(token);
    expect.soft(result.data?.$type).toEqual('fontFamily');
    expect.soft(result.data?.$value).toEqual(['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif']);
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
