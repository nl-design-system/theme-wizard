import { test, expect, describe, expectTypeOf } from 'vitest';
import {
  BaseDesignTokenIdentifierSchema,
  type BaseDesignTokenIdentifier,
  BaseDesignTokenSchema,
  type BaseDesignToken,
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

  test('accepts a bare minimum token', () => {
    const fixture = {
      'my-token-id': {
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
