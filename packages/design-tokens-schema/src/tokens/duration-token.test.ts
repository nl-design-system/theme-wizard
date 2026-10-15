import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  DurationTypeSchema,
  type DurationType,
  DurationUnitSchema,
  type DurationUnit,
  ModernDurationValueSchema,
  type ModernDurationValue,
  ModernDurationTokenSchema,
  type ModernDurationToken,
  DurationWithRefSchema,
  type DurationWithRef,
  DurationTokenSchema,
  type DurationToken,
} from './duration-token';

describe('DurationTypeSchema', () => {
  it('accepts "duration"', () => {
    const result = DurationTypeSchema.safeParse('duration');
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<DurationType>();
  });

  it.each(['dimension', 'time', ''])('rejects invalid type: %s', (type) => {
    const result = DurationTypeSchema.safeParse(type);
    expect(result.success).toBeFalsy();
  });
});

describe('DurationUnitSchema', () => {
  it.each(['s', 'ms'])('accepts valid unit: %s', (unit) => {
    const result = DurationUnitSchema.safeParse(unit);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<DurationUnit>();
  });

  it.each(['sec', 'milliseconds', '', 16])('rejects invalid unit: %s', (unit) => {
    const result = DurationUnitSchema.safeParse(unit);
    expect(result.success).toBeFalsy();
  });
});

describe('ModernDurationValueSchema', () => {
  it.each([
    { unit: 's', value: 0 },
    { unit: 's', value: 1 },
    { unit: 'ms', value: 200 },
    { unit: 'ms', value: 1.5 },
  ] satisfies ModernDurationValue[])('accepts valid duration value: $unit $value', (fixture) => {
    const result = ModernDurationValueSchema.safeParse(fixture);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(fixture);
    expectTypeOf(result.data!).toEqualTypeOf<ModernDurationValue>();
  });

  it('rejects missing unit', () => {
    const result = ModernDurationValueSchema.safeParse({ value: 200 });
    expect(result.success).toBeFalsy();
  });

  it('rejects missing value', () => {
    const result = ModernDurationValueSchema.safeParse({ unit: 'ms' });
    expect(result.success).toBeFalsy();
  });

  it('rejects invalid unit', () => {
    const result = ModernDurationValueSchema.safeParse({ unit: 'sec', value: 200 });
    expect(result.success).toBeFalsy();
  });

  it('rejects string value', () => {
    const result = ModernDurationValueSchema.safeParse({ unit: 'ms', value: '200' });
    expect(result.success).toBeFalsy();
  });

  it('rejects extra properties (strict object)', () => {
    const result = ModernDurationValueSchema.safeParse({ extra: true, unit: 'ms', value: 200 });
    expect(result.success).toBeFalsy();
  });
});

describe('ModernDurationTokenSchema', () => {
  it('accepts a valid modern duration token', () => {
    const token = {
      $type: 'duration',
      $value: { unit: 'ms', value: 200 },
    } satisfies ModernDurationToken;
    const result = ModernDurationTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects wrong $type', () => {
    const result = ModernDurationTokenSchema.safeParse({
      $type: 'dimension',
      $value: { unit: 'ms', value: 200 },
    });
    expect(result.success).toBeFalsy();
  });

  it('rejects legacy string $value', () => {
    const result = ModernDurationTokenSchema.safeParse({
      $type: 'duration',
      $value: '200ms',
    });
    expect(result.success).toBeFalsy();
  });
});

describe('DurationWithRefSchema', () => {
  it('accepts a full-token reference', () => {
    const token = {
      $type: 'duration',
      $value: '{basis.motion.fast}',
    } satisfies DurationWithRef;
    const result = DurationWithRefSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });
});

describe('DurationTokenSchema', () => {
  it('accepts a modern duration token', () => {
    const token = {
      $type: 'duration',
      $value: { unit: 's', value: 1.5 },
    } satisfies DurationToken;
    const result = DurationTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a duration token with a reference value', () => {
    const token = {
      $type: 'duration',
      $value: '{basis.motion.fast}',
    } satisfies DurationToken;
    const result = DurationTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects a token without $type', () => {
    const result = DurationTokenSchema.safeParse({ $value: { unit: 'ms', value: 200 } });
    expect(result.success).toBeFalsy();
  });
});
