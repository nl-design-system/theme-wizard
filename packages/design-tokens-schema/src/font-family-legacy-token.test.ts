import { describe, test, expect, expectTypeOf } from 'vitest';
import { type FontFamilyValue, FontFamilyValueSchema } from './dtcg/font-family-token';
import {
  LegacyFontFamilyTokenSchema,
  LegacyFontFamilyValueSchema,
  type LegacyFontFamilyToken,
  type LegacyFontFamilyValue,
} from './font-family-legacy';

describe('parsing values', () => {
  test('upgrades legacy format with a single comma-separated string', () => {
    const result = LegacyFontFamilyValueSchema.safeParse('serif, sans-serif');
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(['serif', 'sans-serif']);
    expectTypeOf(result.data!).toEqualTypeOf<LegacyFontFamilyValue>();
  });

  test('rejects invalid "families"', () => {
    for (const nonFamily of [16, true, ' ', ',', ' , ']) {
      const result = FontFamilyValueSchema.safeParse(nonFamily);
      expect(result.success).toBeFalsy();
      expectTypeOf(result.data).not.toEqualTypeOf<FontFamilyValue>();
    }
  });
});

describe('legacy token format', () => {
  const token = {
    $type: 'fontFamilies',
    $value: 'Source Sans Pro, Helvetica, Arial, sans-serif',
  };

  test('accepts legacy token', () => {
    const result = LegacyFontFamilyTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<LegacyFontFamilyToken>();
  });

  test('upgrades legacy token', () => {
    const result = LegacyFontFamilyTokenSchema.safeParse(token);
    expect.soft(result.data?.$type).toEqual('fontFamily');
    expect.soft(result.data?.$value).toEqual(['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif']);
  });
});
