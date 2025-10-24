import { test, expect, expectTypeOf } from 'vitest';
import { type FontFamilyValue, FontFamilyValueSchema } from './fontfamily-token';

test('accepts valid font-families', () => {
  const fixtures = ['serif', '💪', 'Arial Black', '-apple-system'];
  for (const fontFamily of fixtures) {
    const result = FontFamilyValueSchema.safeParse(fontFamily);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<FontFamilyValue>();
  }
});

test('rejects invalid ranges', () => {
  for (const nonFamily of [16, true, ' ', 'serif, sans-serif']) {
    const result = FontFamilyValueSchema.safeParse(nonFamily);
    expect(result.success).toBeFalsy();
    expectTypeOf(result.data).not.toEqualTypeOf<FontFamilyValue>();
  }
});
