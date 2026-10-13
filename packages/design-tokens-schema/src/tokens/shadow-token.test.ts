import { dset } from 'dset';
import { describe, it, expect, expectTypeOf } from 'vitest';
import {
  ShadowTypeSchema,
  type ShadowType,
  ShadowValueSchema,
  type ShadowValue,
  ModernShadowValueSchema,
  type ModernShadowValue,
  ModernShadowTokenSchema,
  type ModernShadowToken,
  ShadowWithRefSchema,
  type ShadowWithRef,
  ShadowTokenSchema,
  type ShadowToken,
} from './shadow-token';

/** Builds a fresh, valid shadow value. Pass dot-paths to deeply override properties. */
const createShadow = (overrides: Record<string, unknown> = {}): ShadowValue => {
  const shadow: ShadowValue = {
    blur: { unit: 'rem', value: 1.5 },
    color: { alpha: 0.5, colorSpace: 'srgb', components: [0, 0, 0] },
    offsetX: { unit: 'rem', value: 0.5 },
    offsetY: { unit: 'rem', value: 0.5 },
    spread: { unit: 'rem', value: 0 },
  };
  for (const [path, value] of Object.entries(overrides)) {
    dset(shadow, path, value);
  }
  return shadow;
};

describe('ShadowTypeSchema', () => {
  it('accepts "shadow"', () => {
    const result = ShadowTypeSchema.safeParse('shadow');
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<ShadowType>();
  });

  it.each(['boxShadow', 'color', ''])('rejects invalid type: %s', (type) => {
    const result = ShadowTypeSchema.safeParse(type);
    expect(result.success).toBeFalsy();
  });
});

describe('ShadowValueSchema', () => {
  it('accepts a basic shadow', () => {
    const shadow = createShadow();
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadow);
    expectTypeOf(result.data!).toEqualTypeOf<ShadowValue>();
  });

  it('accepts an inset shadow', () => {
    const shadow = createShadow({ inset: true });
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadow);
  });

  it('accepts a shadow with refs for individual properties', () => {
    const shadow = createShadow({
      color: '{basis.color.shadow}',
      offsetX: '{basis.spacing.sm}',
      offsetY: '{basis.spacing.sm}',
    });
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadow);
    expectTypeOf(result.data!).toEqualTypeOf<ShadowValue>();
  });

  it.each(['blur', 'color', 'offsetX', 'offsetY', 'spread'] as const)('rejects a shadow missing %s', (property) => {
    const shadow: Record<string, unknown> = createShadow();
    delete shadow[property];
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeFalsy();
  });

  it('rejects extra properties (strict object)', () => {
    const shadow = createShadow({ extra: true });
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeFalsy();
  });

  it('rejects a non-boolean inset', () => {
    const shadow = createShadow({ inset: 'true' });
    const result = ShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeFalsy();
  });
});

describe('ModernShadowValueSchema', () => {
  it('accepts a single shadow object', () => {
    const shadow = createShadow();
    const result = ModernShadowValueSchema.safeParse(shadow);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadow);
    expectTypeOf(result.data!).toEqualTypeOf<ModernShadowValue>();
  });

  it('accepts an array of layered shadows', () => {
    const shadows = [createShadow(), createShadow({ offsetY: { unit: 'rem', value: 1 } })] satisfies ModernShadowValue;
    const result = ModernShadowValueSchema.safeParse(shadows);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadows);
    expectTypeOf(result.data!).toEqualTypeOf<ModernShadowValue>();
  });

  it('accepts an array mixing explicit shadows and refs to shadow tokens', () => {
    const shadows = ['{basis.shadow.sm}', createShadow(), '{basis.shadow.lg}'] satisfies ModernShadowValue;
    const result = ModernShadowValueSchema.safeParse(shadows);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(shadows);
    expectTypeOf(result.data!).toEqualTypeOf<ModernShadowValue>();
  });

  it('rejects an array containing an invalid shadow', () => {
    const invalid: Record<string, unknown> = createShadow();
    delete invalid['blur'];
    const result = ModernShadowValueSchema.safeParse([createShadow(), invalid]);
    expect(result.success).toBeFalsy();
  });
});

describe('ModernShadowTokenSchema', () => {
  it('accepts a valid single-shadow token', () => {
    const token = {
      $type: 'shadow',
      $value: createShadow(),
    } satisfies ModernShadowToken;
    const result = ModernShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a valid layered-shadow token', () => {
    const token = {
      $type: 'shadow',
      $value: [createShadow(), createShadow({ inset: true })],
    } satisfies ModernShadowToken;
    const result = ModernShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects wrong $type', () => {
    const result = ModernShadowTokenSchema.safeParse({
      $type: 'color',
      $value: createShadow(),
    });
    expect(result.success).toBeFalsy();
  });

  it('rejects legacy string $value', () => {
    const result = ModernShadowTokenSchema.safeParse({
      $type: 'shadow',
      $value: '0.5rem 0.5rem 1.5rem 0 rgba(0, 0, 0, 0.5)',
    });
    expect(result.success).toBeFalsy();
  });
});

describe('ShadowWithRefSchema', () => {
  it('accepts a full-token reference', () => {
    const token = {
      $type: 'shadow',
      $value: '{basis.shadow.default}',
    } satisfies ShadowWithRef;
    const result = ShadowWithRefSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });
});

describe('ShadowTokenSchema', () => {
  it('accepts a modern shadow token', () => {
    const token = {
      $type: 'shadow',
      $value: createShadow(),
    } satisfies ShadowToken;
    const result = ShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a shadow token with a full-token reference value', () => {
    const token = {
      $type: 'shadow',
      $value: '{basis.shadow.default}',
    } satisfies ShadowToken;
    const result = ShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a shadow token with refs for individual properties', () => {
    const token = {
      $type: 'shadow',
      $value: createShadow({
        color: '{basis.color.shadow}',
        offsetX: '{basis.spacing.sm}',
      }),
    } satisfies ShadowToken;
    const result = ShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('accepts a layered shadow token mixing refs and explicit shadows', () => {
    const token = {
      $type: 'shadow',
      $value: ['{basis.shadow.sm}', createShadow()],
    } satisfies ShadowToken;
    const result = ShadowTokenSchema.safeParse(token);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(token);
  });

  it('rejects a token without $type', () => {
    const result = ShadowTokenSchema.safeParse({ $value: createShadow() });
    expect(result.success).toBeFalsy();
  });
});
