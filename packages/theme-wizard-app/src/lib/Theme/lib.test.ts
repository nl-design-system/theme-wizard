import { describe, expect, it } from 'vitest';
import { flattenTokens, presetTokensToStyle, presetTokensToUpdateMany, refToCssVariable, styleObjectToString, tokensToStyle } from './lib';

describe('styleObjectToString', () => {
  it('returns an empty string for an empty object', () => {
    expect(styleObjectToString({})).toBe('');
  });

  it('serializes a single entry', () => {
    expect(styleObjectToString({ '--my-color': 'red' })).toBe('--my-color:red');
  });

  it('serializes multiple entries joined by semicolons', () => {
    const result = styleObjectToString({ '--color': 'blue', '--size': '16px' });
    expect(result).toBe('--color:blue;--size:16px');
  });
});

describe('flattenTokens', () => {
  it('flattens a nested token tree', () => {
    const tokens = {
      basis: {
        color: {
          $type: 'color',
          $value: '#fff',
        },
      },
    };
    const result = flattenTokens(tokens);
    expect(result).toHaveProperty('basis.color');
  });

  it('skips array values', () => {
    const tokens = {
      foo: [],
    };
    const result = flattenTokens(tokens as never);
    expect(result).toEqual({});
  });
});

describe('refToCssVariable', () => {
  it('converts a token reference to a CSS variable', () => {
    expect(refToCssVariable('{basis.color.accent}')).toBe('var(--basis-color-accent)');
  });

  it('converts multiple references in one string', () => {
    expect(refToCssVariable('calc({a.b} + {c.d})')).toBe('calc(var(--a-b) + var(--c-d))');
  });

  it('returns non-reference strings as-is', () => {
    expect(refToCssVariable('#ff0000')).toBe('#ff0000');
  });
});

describe('presetTokensToUpdateMany', () => {
  it('returns empty array for null', () => {
    expect(presetTokensToUpdateMany(null)).toEqual([]);
  });

  it('returns empty array for non-object', () => {
    expect(presetTokensToUpdateMany('string')).toEqual([]);
    expect(presetTokensToUpdateMany(42)).toEqual([]);
  });

  it('returns empty array for arrays', () => {
    expect(presetTokensToUpdateMany([])).toEqual([]);
  });

  it('returns a single update for a token leaf', () => {
    const result = presetTokensToUpdateMany({ $value: 'red' }, 'my.path');
    expect(result).toEqual([{ path: 'my.path', value: 'red' }]);
  });

  it('flattens nested preset tokens into path-value pairs', () => {
    const tokens = {
      nl: {
        button: {
          'border-radius': { $value: '{basis.border-radius.sm}' },
        },
      },
    };
    const result = presetTokensToUpdateMany(tokens);
    expect(result).toEqual([{ path: 'nl.button.border-radius', value: '{basis.border-radius.sm}' }]);
  });

  it('handles multiple nested token leaves', () => {
    const tokens = {
      nl: {
        button: { color: { $value: 'blue' } },
        paragraph: { 'font-size': { $value: '16px' } },
      },
    };
    const result = presetTokensToUpdateMany(tokens);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual({ path: 'nl.button.color', value: 'blue' });
    expect(result).toContainEqual({ path: 'nl.paragraph.font-size', value: '16px' });
  });
});

describe('presetTokensToStyle', () => {
  it('returns empty style for null', () => {
    expect(presetTokensToStyle(null)).toEqual({});
  });

  it('returns empty style for non-object', () => {
    expect(presetTokensToStyle('string')).toEqual({});
  });

  it('returns empty style for arrays', () => {
    expect(presetTokensToStyle([])).toEqual({});
  });

  it('converts a token leaf with string $value to CSS custom property', () => {
    const result = presetTokensToStyle({ $value: '{basis.color.accent}' }, ['nl', 'button', 'color']);
    expect(result).toEqual({ '--nl-button-color': 'var(--basis-color-accent)' });
  });

  it('ignores token leaf with non-string $value', () => {
    const result = presetTokensToStyle({ $value: 42 }, ['nl', 'size']);
    expect(result).toEqual({});
  });

  it('flattens nested preset tokens into CSS custom properties', () => {
    const tokens = {
      nl: {
        paragraph: {
          'font-size': { $value: '{basis.text.font-size.md}' },
        },
      },
    };
    const result = presetTokensToStyle(tokens);
    expect(result).toEqual({ '--nl-paragraph-font-size': 'var(--basis-text-font-size-md)' });
  });
});

describe('tokensToStyle', () => {
  it('converts a design token tree to CSS custom properties', () => {
    const tokens = {
      nl: {
        button: {
          color: {
            $type: 'color',
            $value: '{basis.color.accent}',
          },
        },
      },
    };
    const result = tokensToStyle(tokens as never);
    expect(result).toEqual({ '--nl-button-color': 'var(--basis-color-accent)' });
  });

  it('returns empty object for empty token tree', () => {
    expect(tokensToStyle({} as never)).toEqual({});
  });

  it('skips tokens with non-string $value', () => {
    const tokens = {
      nl: {
        size: {
          $type: 'number',
          $value: 16,
        },
      },
    };
    const result = tokensToStyle(tokens as never);
    expect(result).toEqual({});
  });
});
