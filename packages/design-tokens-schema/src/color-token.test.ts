import { describe, test, expect, expectTypeOf } from 'vitest';
import { ColorAlphaSchema, type ColorAlpha, type ColorHexFallback, ColorHexFallbackSchema } from './color-token';

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
