import { describe, expect, it } from 'vitest';
import { arrayFromCommaList, arrayFromTokenList, allowedValuesConverter } from './index';

describe('arrayFromTokenList', () => {
  it('should return null for null input', () => {
    const result = arrayFromTokenList(null);
    expect(result).toBe(null);
  });

  it('should return null for empty string', () => {
    const result = arrayFromTokenList('');
    expect(result).toBe(null);
  });

  it('should parse JSON array input', () => {
    const result = arrayFromTokenList('["a", "b", "c"]');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should parse JSON array with numbers', () => {
    const result = arrayFromTokenList('[1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });

  it('should parse JSON array with objects', () => {
    const result = arrayFromTokenList('[{"a": "b"}, {"c": "d"}]');
    expect(result).toEqual([{ a: 'b' }, { c: 'd' }]);
  });

  it('should split whitespace-separated tokens', () => {
    const result = arrayFromTokenList('a b c');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should handle single token', () => {
    const result = arrayFromTokenList('token');
    expect(result).toEqual(['token']);
  });

  it('should handle multiple spaces between tokens', () => {
    const result = arrayFromTokenList('a     b');
    expect(result).toEqual(['a', 'b']);
  });

  it('should handle mixed whitespace types (spaces, tabs, newlines)', () => {
    const result = arrayFromTokenList('a  b\tc\ntoken4');
    expect(result).toEqual(['a', 'b', 'c', 'token4']);
  });

  it('should trim whitespace from input and tokens', () => {
    const result = arrayFromTokenList('  a  b  ');
    expect(result).toEqual(['a', 'b']);
  });

  it('should fall back to splitting for invalid JSON', () => {
    const result = arrayFromTokenList('not-valid-json b');
    expect(result).toEqual(['not-valid-json', 'b']);
  });
});

describe('arrayFromCommaList', () => {
  it('should return null for null input', () => {
    const result = arrayFromCommaList(null);
    expect(result).toBe(null);
  });

  it('should return null for empty string', () => {
    const result = arrayFromCommaList('');
    expect(result).toBe(null);
  });

  it('should parse JSON array input', () => {
    const result = arrayFromCommaList('["a", "b", "c"]');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should parse JSON array with numbers', () => {
    const result = arrayFromCommaList('[1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });

  it('should parse JSON array with objects', () => {
    const result = arrayFromCommaList('[{"a": "b"}, {"c": "d"}]');
    expect(result).toEqual([{ a: 'b' }, { c: 'd' }]);
  });

  it('should split comma-separated values', () => {
    const result = arrayFromCommaList('a,b,c');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should handle single value', () => {
    const result = arrayFromCommaList('value');
    expect(result).toEqual(['value']);
  });

  it('should handle commas with spaces', () => {
    const result = arrayFromCommaList('a , b , c');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should trim whitespace from input and values', () => {
    const result = arrayFromCommaList('  a , b  ');
    expect(result).toEqual(['a', 'b']);
  });

  it('should handle empty values between commas', () => {
    const result = arrayFromCommaList('a,,c');
    expect(result).toEqual(['a', '', 'c']);
  });

  it('should fall back to splitting for invalid JSON', () => {
    const result = arrayFromCommaList('a,b');
    expect(result).toEqual(['a', 'b']);
  });
});

describe('allowedValuesConverter', () => {
  const simpleAllowedValues = ['foo', 'bar', 'baz'] as const;
  it('should return `from` and `to` converters', () => {
    const { fromAttribute, toAttribute } = allowedValuesConverter(simpleAllowedValues, simpleAllowedValues[0]);
    expect.soft(typeof fromAttribute).toBe('function');
    expect.soft(typeof toAttribute).toBe('function');
  });

  it('should return converters that can do a round-trip', () => {
    const { fromAttribute, toAttribute } = allowedValuesConverter(simpleAllowedValues, simpleAllowedValues[0]);
    const attribute = simpleAllowedValues[1];
    const toResult = toAttribute(fromAttribute(attribute));
    expect(toResult).toBe(attribute);
  });

  it('should snap to default value if value is not allowed', () => {
    const defaultValue = simpleAllowedValues[0];
    const { fromAttribute, toAttribute } = allowedValuesConverter(simpleAllowedValues, simpleAllowedValues[0]);
    const attribute = 'bla';
    const toResult = toAttribute(fromAttribute(attribute));
    expect(toResult).toBe(defaultValue);
  });

  it('returns empty string when default value is not supplied', () => {
    const { fromAttribute, toAttribute } = allowedValuesConverter(simpleAllowedValues);
    const attribute = 'bla';
    const fromResult = fromAttribute(attribute);
    const toResult = toAttribute(fromResult);
    expect.soft(fromResult).toBeUndefined();
    expect.soft(toResult).toBe('');
  });
});
