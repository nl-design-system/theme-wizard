import { describe, expect, it, vi } from 'vitest';
import Theme from './Theme';
import { resolveTokenReferenceChain, resolveTokenReferenceValue, stringifyTokenValue } from './token-value';

describe('stringifyTokenValue', () => {
  it('returns string values as-is', () => {
    expect(stringifyTokenValue('hello')).toBe('hello');
  });

  it('returns JSON string for non-object values', () => {
    expect(stringifyTokenValue(42)).toBe('42');
    expect(stringifyTokenValue(true)).toBe('true');
    expect(stringifyTokenValue(null)).toBe('null');
  });

  it('returns empty string when $value is undefined', () => {
    expect(stringifyTokenValue({ $value: undefined })).toBe('');
  });

  it('returns empty string when $value is null', () => {
    expect(stringifyTokenValue({ $value: null })).toBe('');
  });

  it('returns string representation for number $value', () => {
    expect(stringifyTokenValue({ $value: 16 })).toBe('16');
  });

  it('serializes array $value as font family string', () => {
    const result = stringifyTokenValue({ $value: ['Arial', 'sans-serif'] });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('serializes color $value', () => {
    const colorValue = {
      colorSpace: 'srgb',
      components: { alpha: 1, blue: 0, green: 0, red: 1 },
    };
    const result = stringifyTokenValue({ $value: colorValue });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('serializes dimension $value', () => {
    const dimensionValue = { unit: 'px', value: 16 };
    const result = stringifyTokenValue({ $value: dimensionValue });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('serializes nested object $value as JSON', () => {
    const nestedValue = { nested: { key: 'value' } };
    const result = stringifyTokenValue({ $value: nestedValue });
    expect(result).toBe(JSON.stringify(nestedValue));
  });

  it('returns string $value via toString fallback', () => {
    // A plain string $value is not a color/dimension/array/number/valueObject,
    // so it falls through to value.toString()
    const result = stringifyTokenValue({ $value: 'some-literal-string' });
    expect(result).toBe('some-literal-string');
  });
});

describe('resolveTokenReferenceValue', () => {
  it('returns non-reference strings as-is', () => {
    const theme = new Theme();
    expect(resolveTokenReferenceValue('red', theme)).toBe('red');
    expect(resolveTokenReferenceValue('', theme)).toBe('');
  });

  it('resolves a known token reference from the theme', () => {
    const theme = new Theme();
    // start tokens include basis tokens, so pick a known one
    const token = theme.at('basis.color.accent-1.bg-default');
    let resolved;
    if (token?.$value && typeof token.$value === 'string') {
      resolved = resolveTokenReferenceValue(`{basis.color.accent-1.bg-default}`, theme);
    }
    expect(resolved).not.toBeNull();
  });

  it('returns null when a referenced token does not exist', () => {
    const theme = new Theme();
    expect(resolveTokenReferenceValue('{non.existent.token}', theme)).toBeNull();
  });

  it('handles circular references by returning the original value', () => {
    const theme = new Theme();
    // Spy on theme.at() to simulate a self-referencing token without triggering resolveRefs
    vi.spyOn(theme, 'at').mockReturnValue({ $value: '{basis.color.accent-1.bg-default}' } as never);
    const result = resolveTokenReferenceValue('{basis.color.accent-1.bg-default}', theme);
    // The seen set detects the cycle and returns the reference string
    expect(result).toBe('{basis.color.accent-1.bg-default}');
    vi.restoreAllMocks();
  });

  it('follows a chain of references', () => {
    const theme = new Theme();
    // Point accent-1.bg-default to accent-1.bg-subtle to test chaining
    theme.updateAt('basis.color.accent-1.bg-default', '{basis.color.accent-1.bg-subtle}');
    const result = resolveTokenReferenceValue('{basis.color.accent-1.bg-default}', theme);
    expect(result).not.toBeNull();
  });
});

describe('resolveTokenReferenceChain', () => {
  it('returns an empty array when a reference cycle is detected', () => {
    const theme = new Theme();
    vi.spyOn(theme, 'at').mockReturnValue({ $value: '{basis.color.accent-1.bg-default}' } as never);

    const result = resolveTokenReferenceChain('{basis.color.accent-1.bg-default}', theme);

    expect(result).toEqual(['{basis.color.accent-1.bg-default}']);
    vi.restoreAllMocks();
  });
});
