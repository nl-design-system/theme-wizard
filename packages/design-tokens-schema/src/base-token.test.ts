import { test, expect, describe, expectTypeOf } from 'vitest';
import {
  BaseDesignTokenIdentifierSchema,
  type BaseDesignTokenIdentifier,
  BaseDesignTokenSchema,
  type BaseDesignToken,
  BaseDesignTokenValueSchema,
} from './index';

describe('BaseDesignTokenNameSchema', () => {
  test('accepts simple strings', () => {
    for (const fixture of ['a', 'abc', '1', 'dashed-ident', 'snake_ident', '123abc']) {
      const result = BaseDesignTokenIdentifierSchema.safeParse(fixture);
      expect.soft(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<BaseDesignTokenIdentifier>();
    }
  });

  test('rejects invalid types', () => {
    for (const fixture of [1, {}]) {
      expect.soft(BaseDesignTokenIdentifierSchema.safeParse(fixture).success).toBeFalsy();
    }
  });

  test('rejects forbidden characters', () => {
    for (const fixture of ['', '$test', '{ref}', 'test.123']) {
      expect.soft(BaseDesignTokenIdentifierSchema.safeParse(fixture).success).toBeFalsy();
    }
  });
});

describe('BaseDesignTokenSchema', () => {
  test('accepts objects with only valid properties', () => {
    const fixture = {
      'my-token-id': {
        $description: 'This is an unknown token',
        $type: 'my-token-type',
        $value: 'not-important',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<BaseDesignToken>();
  });

  describe('$description', () => {
    const fixture = {
      $type: 'unknown',
      $value: 'value',
    };

    test('MUST be a string', () => {
      const token = { ...fixture, $description: 'test' };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MUST not be null', () => {
      const token = { ...fixture, $description: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  describe('$deprecated', () => {
    const fixture = {
      $type: 'unknown',
      $value: 'value',
    };

    test('MAY be true', () => {
      const token = { ...fixture, $deprecated: true };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MAY be false', () => {
      const token = { ...fixture, $deprecated: false };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MAY be a string', () => {
      const token = { ...fixture, $deprecated: 'Use X or Y instead' };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MUST not be null', () => {
      const token = { ...fixture, $deprecated: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  describe('$extensions', () => {
    const fixture = {
      $type: 'unknown',
      $value: 'value',
    };

    test('MAY be an empty record', () => {
      const token = { ...fixture, $extensions: {} };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MAY be an simple record', () => {
      const token = { ...fixture, $extensions: { test: 1 } };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    test('MUST not be null', () => {
      const token = { ...fixture, $extensions: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  test('accepts a bare minimum token', () => {
    const fixture = {
      'my-token-id': {
        $type: 'unknown',
        $value: 'not-important',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeTruthy();
    expectTypeOf(result.data!).toEqualTypeOf<BaseDesignToken>();
  });

  test('rejects objects with unknown properties', () => {
    const fixture = {
      'my-token-id': {
        $type: 'my-token-type',
        $value: 'not-important',
        unkown_property: 'unknown',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeFalsy();
    expectTypeOf(result.data).not.toEqualTypeOf<BaseDesignToken>();
  });

  test('rejects tokens without a $value', () => {
    const fixture = {
      'my-token-id': {
        $type: 'my-token-type',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeFalsy();
    expectTypeOf(result.data).not.toEqualTypeOf<BaseDesignToken>();
  });

  test('rejects tokens with an invalid ID', () => {
    const fixture = {
      $tokenName: {
        $type: 'my-token-type',
      },
      [Symbol('test')]: {
        $type: 'my-token-type',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeFalsy();
    expectTypeOf(result.data).not.toEqualTypeOf<BaseDesignToken>();
  });
});
