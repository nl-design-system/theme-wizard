import { it, expect, describe, expectTypeOf } from 'vitest';
import {
  BaseDesignTokenIdentifierSchema,
  type BaseDesignTokenIdentifier,
  BaseDesignTokenSchema,
  type BaseDesignToken,
  BaseDesignTokenValueSchema,
} from './index';

describe('BaseDesignTokenNameSchema', () => {
  it('accepts simple strings', () => {
    for (const fixture of ['a', 'abc', '1', 'dashed-ident', 'snake_ident', '123abc']) {
      const result = BaseDesignTokenIdentifierSchema.safeParse(fixture);
      expect.soft(result.success).toBeTruthy();
      expectTypeOf(result.data!).toEqualTypeOf<BaseDesignTokenIdentifier>();
    }
  });

  it('rejects invalid types', () => {
    for (const fixture of [1, {}]) {
      expect.soft(BaseDesignTokenIdentifierSchema.safeParse(fixture).success).toBeFalsy();
    }
  });

  it('rejects forbidden characters', () => {
    for (const fixture of ['', '$test', '{ref}', 'test.123']) {
      expect.soft(BaseDesignTokenIdentifierSchema.safeParse(fixture).success).toBeFalsy();
    }
  });
});

describe('BaseDesignTokenSchema', () => {
  it('accepts objects with only valid properties', () => {
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

    it('MUST be a string', () => {
      const token = { ...fixture, $description: 'test' };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MUST not be null', () => {
      const token = { ...fixture, $description: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  describe('$deprecated', () => {
    const fixture = {
      $type: 'unknown',
      $value: 'value',
    };

    it('MAY be true', () => {
      const token = { ...fixture, $deprecated: true };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MAY be false', () => {
      const token = { ...fixture, $deprecated: false };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MAY be a string', () => {
      const token = { ...fixture, $deprecated: 'Use X or Y instead' };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MUST not be null', () => {
      const token = { ...fixture, $deprecated: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  describe('$extensions', () => {
    const fixture = {
      $type: 'unknown',
      $value: 'value',
    };

    it('MAY be an empty record', () => {
      const token = { ...fixture, $extensions: {} };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MAY be an simple record', () => {
      const token = { ...fixture, $extensions: { test: 1 } };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(true);
    });

    it('MUST not be null', () => {
      const token = { ...fixture, $extensions: null };
      expect(BaseDesignTokenValueSchema.safeParse(token).success).toEqual(false);
    });
  });

  it('accepts a bare minimum token', () => {
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

  it('strips unknown properties (metadata) from tokens', () => {
    const fixture = {
      'my-token-id': {
        $type: 'my-token-type',
        $value: 'not-important',
        filePath: 'src/tokens.json',
        isSource: true,
        name: 'myTokenId',
        attributes: { category: 'my', type: 'token-type' },
        original: { $type: 'my-token-type', $value: 'original' },
        path: ['my', 'token', 'id'],
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeTruthy();
    // Verify metadata is stripped from output
    expect(result.data?.['my-token-id']).toEqual({
      $type: 'my-token-type',
      $value: 'not-important',
    });
  });

  it('rejects tokens without a $value', () => {
    const fixture = {
      'my-token-id': {
        $type: 'my-token-type',
      },
    };
    const result = BaseDesignTokenSchema.safeParse(fixture);
    expect(result.success).toBeFalsy();
    expectTypeOf(result.data).not.toEqualTypeOf<BaseDesignToken>();
  });

  it('rejects tokens with an invalid ID', () => {
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
