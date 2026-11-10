import { describe, it, expect } from 'vitest';
import { mergeTokens } from './merge-tokens';

describe('mergeTokens', () => {
  it('returns empty object for empty input', () => {
    expect(mergeTokens([])).toEqual({});
  });

  it('returns clone of single group', () => {
    const group = { color: { $type: 'color', $value: '#ff0000' } };
    expect(mergeTokens([group])).toEqual(group);
  });

  it('merges non-overlapping keys', () => {
    const a = { color: { $value: 'red' } };
    const b = { spacing: { $value: '8px' } };
    expect(mergeTokens([a, b])).toEqual({ color: { $value: 'red' }, spacing: { $value: '8px' } });
  });

  it('last group overwrites first on conflict', () => {
    const a = { color: { $value: 'red' } };
    const b = { color: { $value: 'blue' } };
    expect(mergeTokens([a, b])).toEqual({ color: { $value: 'blue' } });
  });

  it('deep merges nested objects without losing sibling keys', () => {
    const a = { basis: { color: { primary: { $value: 'red' } }, spacing: { sm: { $value: '4px' } } } };
    const b = { basis: { color: { secondary: { $value: 'blue' } } } };
    expect(mergeTokens([a, b])).toEqual({
      basis: {
        color: { primary: { $value: 'red' }, secondary: { $value: 'blue' } },
        spacing: { sm: { $value: '4px' } },
      },
    });
  });

  it('deduplicates identical tokens', () => {
    const token = { color: { $type: 'color', $value: '#ff0000' } };
    expect(mergeTokens([token, token])).toEqual(token);
  });

  it('last of three overwrites earlier duplicates', () => {
    const a = { color: { $value: 'red' } };
    const b = { color: { $value: 'green' } };
    const c = { color: { $value: 'blue' } };
    expect(mergeTokens([a, b, c])).toEqual({ color: { $value: 'blue' } });
  });

  it('replaces a token as a whole instead of merging its properties', () => {
    const a = {
      color: { $type: 'color', $value: '#ff0000', original: { $type: 'color', $value: '{basis.color.accent-1}' } },
    };
    const b = { color: { $type: 'color', $value: '{basis.color.action-1}' } };
    expect(mergeTokens([a, b])).toEqual({ color: { $type: 'color', $value: '{basis.color.action-1}' } });
  });

  it('keeps the earlier $type when the overriding token has none', () => {
    const a = { color: { $type: 'color', $value: '#ff0000', original: { $value: '{a}' } } };
    const b = { color: { $value: '#0000ff' } };
    expect(mergeTokens([a, b])).toEqual({ color: { $type: 'color', $value: '#0000ff' } });
  });

  it('does not mutate input groups', () => {
    const a = { color: { $value: 'red' } };
    const b = { color: { $value: 'blue' } };
    const aCopy = structuredClone(a);
    mergeTokens([a, b]);
    expect(a).toEqual(aCopy);
  });
});
