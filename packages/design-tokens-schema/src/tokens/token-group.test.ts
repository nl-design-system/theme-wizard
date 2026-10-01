import { describe, it, expect } from 'vitest';
import { isTokenGroup } from './token-group';

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
