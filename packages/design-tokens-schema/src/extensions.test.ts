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
