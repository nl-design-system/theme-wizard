import { it, describe, expect } from 'vitest';
import type { BaseDesignToken } from './tokens/base-token';
import { setExtension } from './extensions';

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

  it('ignores __proto__ key', () => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    setExtension(token, '__proto__', { polluted: true });
    expect(token.$extensions).toBeUndefined();
    expect(({} as Record<PropertyKey, unknown>)['polluted']).toBeUndefined();
  });

  it('ignores constructor key', () => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    setExtension(token, 'constructor', { polluted: true });
    expect(token.$extensions).toBeUndefined();
    expect(({} as Record<PropertyKey, unknown>)['polluted']).toBeUndefined();
  });

  it('ignores prototype key', () => {
    const token: BaseDesignToken = { $type: 'number', $value: 1 };
    setExtension(token, 'prototype', { polluted: true });
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
