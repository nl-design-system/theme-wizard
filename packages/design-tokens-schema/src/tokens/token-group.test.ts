import { describe, it, expect } from 'vitest';
import { getGroupTokens, getTokenGroupType, isTokenGroup, isTokenGroupOfType, TokenGroupSchema } from './token-group';

describe('isTokenGroup', () => {
  const colorTokenWhite = { $type: 'color', $value: '#ffffff' };

  it('returns true for a plain group of tokens', () => {
    expect(
      isTokenGroup({
        'bg-document': colorTokenWhite,
        'color-default': { $type: 'color', $value: '#000000' },
      }),
    ).toBe(true);
  });

  it('returns true when group has $type', () => {
    expect(
      isTokenGroup({
        $type: 'color',
        'bg-document': colorTokenWhite,
      }),
    ).toBe(true);
  });

  it('returns true when group has $extensions', () => {
    expect(
      isTokenGroup({
        $extensions: { 'some.extension': 'value' },
        'bg-document': colorTokenWhite,
      }),
    ).toBe(true);
  });

  it('returns false when object has $value (it is a token, not a group)', () => {
    expect(isTokenGroup(colorTokenWhite)).toBe(false);
  });

  it('returns false when a child is not a token', () => {
    expect(
      isTokenGroup({
        'bg-document': colorTokenWhite,
        'not-a-token': 'just a string',
      }),
    ).toBe(false);
  });

  it('returns false for null', () => {
    expect(isTokenGroup(null)).toBe(false);
  });

  it('returns false for a plain string', () => {
    expect(isTokenGroup('basis.color.accent-1')).toBe(false);
  });

  it('returns false when $type is not a string', () => {
    expect(
      isTokenGroup({
        $type: 42,
        'bg-document': colorTokenWhite,
      }),
    ).toBe(false);
  });

  it('returns false when $extensions is not an object', () => {
    expect(
      isTokenGroup({
        $extensions: 'invalid',
        'bg-document': colorTokenWhite,
      }),
    ).toBe(false);
  });
});

describe('TokenGroupSchema', () => {
  it('allows a group with no $-properties', () => {
    expect(TokenGroupSchema.safeParse({ 'bg-document': { $type: 'color', $value: '#ffffff' } }).success).toBe(true);
  });

  describe('unknown $-prefixed properties', () => {
    it('rejects an unrecognized $-property', () => {
      expect(TokenGroupSchema.safeParse({ $testme: { $type: 'yes' } }).success).toBe(false);
    });

    it('rejects a likely typo of a known $-property', () => {
      expect(TokenGroupSchema.safeParse({ $extens: { 'some.extension': 'value' } }).success).toBe(false);
    });

    it('rejects an unrecognized $-property alongside otherwise-valid properties', () => {
      expect(
        TokenGroupSchema.safeParse({
          $description: 'The accent colors',
          $testme: 'anything',
          'bg-document': { $type: 'color', $value: '#ffffff' },
        }).success,
      ).toBe(false);
    });

    it('rejects an unrecognized $-property on a nested group', () => {
      expect(
        TokenGroupSchema.safeParse({
          accent: {
            $testme: 'anything',
            'accent-1': { $type: 'color', $value: '#ff0000' },
          },
        }).success,
      ).toBe(false);
    });

    it('still allows non-$-prefixed keys, which are nested tokens/groups, not group properties', () => {
      expect(
        TokenGroupSchema.safeParse({
          'not-a-dollar-key': { $type: 'color', $value: '#ffffff' },
        }).success,
      ).toBe(true);
    });
  });

  describe('$deprecated', () => {
    it('allows a valid $deprecated boolean', () => {
      expect(TokenGroupSchema.safeParse({ $deprecated: true }).success).toBe(true);
    });

    it('allows a valid $deprecated string', () => {
      expect(TokenGroupSchema.safeParse({ $deprecated: 'use basis.color.accent-2 instead' }).success).toBe(true);
    });

    it('rejects a non-boolean, non-string $deprecated', () => {
      expect(TokenGroupSchema.safeParse({ $deprecated: 42 }).success).toBe(false);
    });
  });

  describe('$description', () => {
    it('allows a valid $description string', () => {
      expect(TokenGroupSchema.safeParse({ $description: 'The accent colors' }).success).toBe(true);
    });

    it('rejects a non-string $description', () => {
      expect(TokenGroupSchema.safeParse({ $description: 42 }).success).toBe(false);
    });
  });

  describe('$extends', () => {
    it('allows a valid $extends reference', () => {
      const result = TokenGroupSchema.safeParse({ $extends: '{basis.color.accent-1}' });
      expect.soft(result.success).toBe(true);
      expect.soft(result.data?.$extends).toBe('{basis.color.accent-1}');
    });

    it('rejects an invalid $extends reference', () => {
      expect(TokenGroupSchema.safeParse({ $extends: 'basis.color.accent-1' }).success).toBe(false);
    });
  });

  describe('$extensions', () => {
    it('allows a valid $extensions object', () => {
      expect(TokenGroupSchema.safeParse({ $extensions: { 'some.extension': 'value' } }).success).toBe(true);
    });

    it('rejects a non-object $extensions', () => {
      expect(TokenGroupSchema.safeParse({ $extensions: 'invalid' }).success).toBe(false);
    });
  });

  describe('$type', () => {
    it('allows a valid $type string', () => {
      expect(TokenGroupSchema.safeParse({ $type: 'color' }).success).toBe(true);
    });

    it('rejects a non-string $type', () => {
      expect(TokenGroupSchema.safeParse({ $type: 42 }).success).toBe(false);
    });
  });

  describe('$value', () => {
    it('rejects a group that has a $value (that would make it a token)', () => {
      expect(TokenGroupSchema.safeParse({ $type: 'color', $value: '#ffffff' }).success).toBe(false);
    });
  });

  describe('nested children', () => {
    it('allows a nested group alongside tokens', () => {
      expect(
        TokenGroupSchema.safeParse({
          'accent-1': {
            'color-default': { $type: 'color', $value: '#ff0000' },
          },
          transparent: { $type: 'color', $value: '#ffffffff' },
        }).success,
      ).toBe(true);
    });

    it('allows deeply nested groups', () => {
      expect(
        TokenGroupSchema.safeParse({
          basis: {
            color: {
              'accent-1': {
                'color-default': { $type: 'color', $value: '#ff0000' },
              },
            },
          },
        }).success,
      ).toBe(true);
    });

    it('rejects a nested group whose own child is not a token or group', () => {
      expect(
        TokenGroupSchema.safeParse({
          accent: {
            'not-a-token': 'just a string',
          },
        }).success,
      ).toBe(false);
    });
  });
});

describe('getGroupTokens', () => {
  const colorTokenWhite = { $type: 'color', $value: '#ffffff' };

  it('returns direct tokens of the group', () => {
    const colorTokenBlack = { $type: 'color', $value: '#000000' };
    expect(
      getGroupTokens({
        'bg-document': colorTokenWhite,
        'color-default': colorTokenBlack,
      }),
    ).toEqual([colorTokenWhite, colorTokenBlack]);
  });

  it('excludes $-prefixed group properties', () => {
    expect(
      getGroupTokens({
        $description: 'The accent colors',
        $type: 'color',
        'bg-document': colorTokenWhite,
      }),
    ).toEqual([colorTokenWhite]);
  });

  it('excludes nested groups', () => {
    expect(
      getGroupTokens({
        accent: {
          'accent-1': { $type: 'color', $value: '#ff0000' },
        },
        'bg-document': colorTokenWhite,
      }),
    ).toEqual([colorTokenWhite]);
  });

  it('returns an empty array when the group has no direct tokens', () => {
    expect(getGroupTokens({})).toEqual([]);
  });

  it('returns an empty array when the group only has nested groups', () => {
    expect(
      getGroupTokens({
        accent: {
          'accent-1': { $type: 'color', $value: '#ff0000' },
        },
      }),
    ).toEqual([]);
  });
});

describe('getTokenGroupType', () => {
  const colorTokenWhite = { $type: 'color', $value: '#ffffff' };

  it('returns the group own $type when present', () => {
    expect(
      getTokenGroupType({
        $type: 'color',
        'bg-document': { $value: '#ffffff' },
      }),
    ).toBe('color');
  });

  it('returns the shared $type of its direct tokens when all explicit types match', () => {
    expect(
      getTokenGroupType({
        'bg-document': colorTokenWhite,
        'color-default': { $type: 'color', $value: '#000000' },
      }),
    ).toBe('color');
  });

  it('returns undefined when direct tokens have conflicting $type', () => {
    expect(
      getTokenGroupType({
        color: colorTokenWhite,
        'font-size': { $type: 'dimension', $value: '16px' },
      }),
    ).toBeUndefined();
  });

  it('returns undefined when no $type can be determined', () => {
    expect(getTokenGroupType({})).toBeUndefined();
  });

  it('ignores nested groups, only looking at direct tokens', () => {
    expect(
      getTokenGroupType({
        accent: {
          'accent-1': { $type: 'dimension', $value: '4px' },
        },
      }),
    ).toBeUndefined();
  });

  it('skips tokens without their own $type and still finds the shared type', () => {
    expect(
      getTokenGroupType({
        'bg-document': { $value: '#ffffff' },
        'color-default': colorTokenWhite,
      }),
    ).toBe('color');
  });

  it('returns undefined when obj is not a token group', () => {
    // @ts-expect-error testing runtime behavior for invalid input
    expect(getTokenGroupType(colorTokenWhite)).toBeUndefined();
  });

  it.each([null, undefined])('returns undefined for %s', (val) => {
    // @ts-expect-error testing runtime behavior for invalid input
    expect(getTokenGroupType(val)).toBeUndefined();
  });
});

describe('isTokenGroupOfType', () => {
  const colorTokenWhite = { $type: 'color', $value: '#ffffff' };

  it('returns true when all token children match the given $type', () => {
    expect(
      isTokenGroupOfType(
        {
          'bg-document': colorTokenWhite,
          'color-default': { $type: 'color', $value: '#000000' },
        },
        'color',
      ),
    ).toBe(true);
  });

  describe('group must have at least one token of matching $type', () => {
    it('applies to token with explicit $type', () => {
      const basisColor = {
        'bg-default': {
          $type: 'color',
          $value: '#ff0000',
        },
      };
      expect(isTokenGroupOfType(basisColor, 'color')).toBe(true);
    });

    it('applies to token with inherited $type', () => {
      const basisColor = {
        $type: 'color',
        'bg-default': {
          $value: '#ff0000',
        },
      };
      expect(isTokenGroupOfType(basisColor, 'color')).toBe(true);
    });
  });

  it('returns false when it is a mixed group (like form-control, or heading)', () => {
    expect(
      isTokenGroupOfType(
        {
          color: colorTokenWhite,
          'font-size': { $type: 'dimension', $value: '16px' },
        },
        'color',
      ),
    ).toBe(false);
  });

  it('checks the $type property of the group itself', () => {
    expect(
      isTokenGroupOfType(
        {
          $type: 'dimension',
          color: colorTokenWhite,
        },
        'color',
      ),
    ).toBe(false);
  });

  it('does not recurse into nested groups', () => {
    expect(
      isTokenGroupOfType(
        {
          accent: {
            'accent-1': { $type: 'dimension', $value: '4px' },
          },
        },
        'color',
      ),
    ).toBe(false);
  });

  it('returns false when obj is not a token group', () => {
    // @ts-expect-error testing runtime behavior for invalid input
    expect(isTokenGroupOfType(colorTokenWhite, 'color')).toBe(false);
  });

  it.each([null, undefined, {}])('returns false for %s', (val) => {
    // @ts-expect-error testing runtime behavior for invalid input
    expect(isTokenGroupOfType(val, 'color')).toBe(false);
  });
});
