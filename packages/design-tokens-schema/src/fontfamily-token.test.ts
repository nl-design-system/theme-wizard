import { describe, test, expect, expectTypeOf } from 'vitest';
import {
  type FontFamilyValue,
  ModernFontFamilyValueSchema,
  LegacyFontFamilyValueSchema,
  type LegacyFontFamilyValue,
  FontFamilyTokenSchema,
  FontFamilyToken,
} from './fontfamily-token';

describe('parsing values', () => {
  test('accepts valid font-families', () => {
    const fixtures = ['serif', '💪', 'Arial Black', '-apple-system'];
    for (const fontFamily of fixtures) {
      const result = ModernFontFamilyValueSchema.safeParse(fontFamily);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<FontFamilyValue>();
    }
  });

  test('upgrades legacy format with a single comma-separated string', () => {
    const result = LegacyFontFamilyValueSchema.safeParse('serif, sans-serif');
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(['serif', 'sans-serif']);
    expectTypeOf(result.data!).toEqualTypeOf<LegacyFontFamilyValue>();
  });

  test('rejects invalid "families"', () => {
    for (const nonFamily of [16, true, ' ', ',', ' , ']) {
      const result = ModernFontFamilyValueSchema.safeParse(nonFamily);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<FontFamilyValue>();
    }
  });
});

test('accepts modern token', () => {
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

  test('accepts legacy token', () => {
    const result = FontFamilyTokenSchema.safeParse(token);
    expect.soft(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<FontFamilyToken>();
  });

  test('upgrades legacy token', () => {
    const result = FontFamilyTokenSchema.safeParse(token);
    expect.soft(result.data?.$type).toEqual('fontFamily');
    expect.soft(result.data?.$value).toEqual(['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif']);
  });
});
