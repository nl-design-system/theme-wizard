import { describe, test, expect, expectTypeOf } from 'vitest';
import {
  type FontFamilyValue,
  FontFamilyValueSchema,
  FontFamilyTokenSchema,
  FontFamilyToken,
} from './font-family-token';

describe('parsing values', () => {
  test('accepts valid font-families', () => {
    const fixtures = ['serif', '💪', 'Arial Black', '-apple-system'];
    for (const fontFamily of fixtures) {
      const result = FontFamilyValueSchema.safeParse(fontFamily);
      expect(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<FontFamilyValue>();
    }
  });

  test('rejects invalid "families"', () => {
    for (const nonFamily of [16, true, ' ', ',', ' , ']) {
      const result = FontFamilyValueSchema.safeParse(nonFamily);
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
