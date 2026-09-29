import { it, describe, expect, expectTypeOf } from 'vitest';
import type { BaseDesignToken } from './tokens/base-token';
import { getExtension, setExtension } from './extensions';
import { EXTENSION_TOKEN_SUBTYPE, type TokenSubtype } from './token-subtype';
import { EXTENSION_REFERENCE_COUNT } from './token-usage';

describe('single value', () => {
  it('sets a single extension', () => {
    const token: BaseDesignToken = {
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 16,
      },
    };
    setExtension(token, 'sub-type', 'font-size');
    expect(token['$extensions']?.['sub-type']).toBe('font-size');
  });

  it('overwrites an existing extension', () => {
    const token: BaseDesignToken = {
      $extensions: {
        'sub-type': 'font-size',
      },
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 16,
      },
    };
    setExtension(token, 'sub-type', 'line-height');
    expect(token['$extensions']?.['sub-type']).toBe('line-height');
  });
});

describe('prototype pollution prevention', () => {
  // setExtensions pollution guard fires before $extensions is initialised — $extensions must stay absent

  it.each(['__proto__', 'constructor', 'prototype'])('ignores %s key', (key) => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    setExtension(token, key, { polluted: true });
    expect(token.$extensions).toBeUndefined();
    expect(({} as Record<PropertyKey, unknown>)['polluted']).toBeUndefined();
  });
});

describe('extension arrays', () => {
  it('sets an extension when no extension is on the object yet', () => {
    const token: BaseDesignToken = {
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 16,
      },
    };
    setExtension(token, 'contrast-with', ['a', 'b']);
    expect(token['$extensions']?.['contrast-with']).toEqual(['a', 'b']);
  });

  it('does not add duplicate values', () => {
    const smallFont = {
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 10,
      },
    };
    const bigFont = {
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 24,
      },
    };
    const token: BaseDesignToken = {
      $extensions: {
        'test-ext': [smallFont],
      },
      $type: 'dimension',
      $value: {
        unit: 'px',
        value: 16,
      },
    };
    setExtension(token, 'test-ext', [smallFont, bigFont]);
    expect(token['$extensions']?.['test-ext']).toEqual([smallFont, bigFont]);
  });
});

describe('getExtension', () => {
  it('reads an existing extension value', () => {
    const token: BaseDesignToken = {
      $extensions: { 'sub-type': 'font-size' },
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    };
    expect(getExtension(token, 'sub-type')).toBe('font-size');
  });

  it('reads extensions on a token group, not just leaf tokens', () => {
    const group = {
      $extensions: { 'sub-type': 'brand' },
      red: { $type: 'color', $value: '#ff0000' },
    };
    expect(getExtension(group, 'sub-type')).toBe('brand');
  });

  it('returns undefined for a key not present in $extensions', () => {
    const token: BaseDesignToken = {
      $extensions: { 'sub-type': 'font-size' },
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    };
    expect(getExtension(token, 'missing-key')).toBeUndefined();
  });

  it('returns undefined when the object has no $extensions', () => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    expect(getExtension(token, 'sub-type')).toBeUndefined();
  });

  it('returns undefined when the input object itself is undefined', () => {
    expect(getExtension(undefined, 'sub-type')).toBeUndefined();
  });

  it('returns undefined when $extensions is not a value object (null, array, primitive)', () => {
    expect(getExtension({ $extensions: null }, 'sub-type')).toBeUndefined();
    expect(getExtension({ $extensions: ['sub-type'] }, 'sub-type')).toBeUndefined();
    expect(getExtension({ $extensions: 'sub-type' }, 'sub-type')).toBeUndefined();
  });

  it('reflects mutations made by setExtension', () => {
    const token: BaseDesignToken = { $type: 'dimension', $value: { unit: 'px', value: 16 } };
    setExtension(token, 'sub-type', 'font-size');
    expect(getExtension(token, 'sub-type')).toBe('font-size');
  });
});

describe('getExtension type inference', () => {
  it('infers a primitive type registered in ExtensionTypeMap', () => {
    const token: BaseDesignToken = {
      $extensions: { [EXTENSION_REFERENCE_COUNT]: 3 },
      $type: 'color',
      $value: '#ff0000',
    };
    const result = getExtension(token, EXTENSION_REFERENCE_COUNT);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toBe(3);
  });

  it('infers a union type registered in ExtensionTypeMap', () => {
    const token: BaseDesignToken = {
      $extensions: { [EXTENSION_TOKEN_SUBTYPE]: 'font-size' },
      $type: 'dimension',
      $value: { unit: 'px', value: 16 },
    };
    const result = getExtension(token, EXTENSION_TOKEN_SUBTYPE);
    expectTypeOf(result).toEqualTypeOf<TokenSubtype | undefined>();
    expect(result).toBe('font-size');
  });

  it('falls back to unknown for a key with no ExtensionTypeMap entry', () => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    const result = getExtension(token, 'not-a-registered-extension');
    expectTypeOf(result).toEqualTypeOf<unknown>();
    expect(result).toBeUndefined();
  });
});
