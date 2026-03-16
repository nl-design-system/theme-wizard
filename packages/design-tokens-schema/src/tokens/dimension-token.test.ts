import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  DimensionUnitSchema,
  type DimensionUnit,
  ModernDimensionValueSchema,
  type ModernDimensionValue,
  ModernDimensionTokenSchema,
  type ModernDimensionToken,
  DimensionTokenSchema,
  type DimensionToken,
  stringifyDimension,
} from './dimension-token';

describe('DimensionUnitSchema', () => {
  it.each(['px', 'rem'])('accepts valid unit: %s', (unit) => {
    const result = DimensionUnitSchema.safeParse(unit);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<DimensionUnit>();
  });

  it.each(['em', 'vw', '%', 'pt', '', 16])('rejects invalid unit: %s', (unit) => {
    const result = DimensionUnitSchema.safeParse(unit);
    expect(result.success).toBeFalsy();
  });
});

describe('ModernDimensionValueSchema', () => {
  it.each([
    { unit: 'px', value: 0 },
    { unit: 'px', value: 16 },
    { unit: 'rem', value: 1 },
    { unit: 'rem', value: 1.5 },
  ] satisfies ModernDimensionValue[])('accepts valid dimension value: $unit $value', (fixture) => {
    const result = ModernDimensionValueSchema.safeParse(fixture);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(fixture);
    expectTypeOf(result.data!).toEqualTypeOf<ModernDimensionValue>();
  });

  it('rejects missing unit', () => {
    const result = ModernDimensionValueSchema.safeParse({ value: 16 });
    expect(result.success).toBeFalsy();
  });

  it('rejects missing value', () => {
    const result = ModernDimensionValueSchema.safeParse({ unit: 'px' });
    expect(result.success).toBeFalsy();
  });

  it('rejects invalid unit', () => {
    const result = ModernDimensionValueSchema.safeParse({ unit: 'em', value: 16 });
    expect(result.success).toBeFalsy();
  });

  it('rejects string value', () => {
    const result = ModernDimensionValueSchema.safeParse({ unit: 'px', value: '16' });
    expect(result.success).toBeFalsy();
  });

  it('rejects extra properties (strict object)', () => {
    const result = ModernDimensionValueSchema.safeParse({ extra: true, unit: 'px', value: 16 });
    expect(result.success).toBeFalsy();
  });
});

describe('ModernDimensionTokenSchema', () => {
  it('accepts a valid modern dimension token', () => {
    const token = {
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    } satisfies ModernDimensionToken;
    const result = ModernDimensionTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects wrong $type', () => {
    const result = ModernDimensionTokenSchema.safeParse({
      $type: 'color',
      $value: { unit: 'px', value: 16 },
    });
    expect(result.success).toBeFalsy();
  });

  it('rejects legacy string $value', () => {
    const result = ModernDimensionTokenSchema.safeParse({
      $type: 'dimension',
      $value: '16px',
    });
    expect(result.success).toBeFalsy();
  });
});

describe('DimensionTokenSchema', () => {
  it('accepts a modern dimension token', () => {
    const token = {
      $type: 'dimension',
      $value: { unit: 'rem', value: 1.5 },
    } satisfies DimensionToken;
    const result = DimensionTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a dimension token with a reference value', () => {
    const token = {
      $type: 'dimension',
      $value: '{basis.spacing.sm}',
    } satisfies DimensionToken;
    const result = DimensionTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects a token without $type', () => {
    const result = DimensionTokenSchema.safeParse({ $value: { unit: 'px', value: 8 } });
    expect(result.success).toBeFalsy();
  });
});

describe('stringifyDimension', () => {
  it.each([
    [{ unit: 'px', value: 16 } satisfies ModernDimensionValue, '16px'],
    [{ unit: 'rem', value: 1.5 } satisfies ModernDimensionValue, '1.5rem'],
    [{ unit: 'px', value: 0 } satisfies ModernDimensionValue, '0px'],
    [{ unit: 'px', value: -0 } satisfies ModernDimensionValue, '0px'],
  ])('stringifies %o to %s', (input, expected) => {
    expect(stringifyDimension(input)).toBe(expected);
  });
});
