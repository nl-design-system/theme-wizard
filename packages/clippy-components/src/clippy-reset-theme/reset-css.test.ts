import { describe, expect, it } from 'vitest';
import { createResetStylesheet, tokenPathToCSSCustomProperty } from './reset-css';

describe('tokenPathToCSSCustomProperty', () => {
  it('converts a single-segment path to a CSS custom property', () => {
    expect(tokenPathToCSSCustomProperty(['color'])).toBe('--color');
  });

  it('joins multiple segments with hyphens', () => {
    expect(tokenPathToCSSCustomProperty(['nl', 'color', 'red'])).toBe('--nl-color-red');
  });

  it('returns just "--" for an empty path', () => {
    expect(tokenPathToCSSCustomProperty([])).toBe('--');
  });

  it('preserves existing hyphens within segments', () => {
    expect(tokenPathToCSSCustomProperty(['font-size', 'base'])).toBe('--font-size-base');
  });
});

describe('createResetStylesheet', () => {
  it('uses ".reset-theme" as the default selector', () => {
    const result = createResetStylesheet([]);
    expect(result).toMatch(/^\.reset-theme\s*\{/);
  });

  it('uses the provided selector', () => {
    const result = createResetStylesheet([], ':host');
    expect(result).toMatch(/^:host\s*\{/);
  });

  it('returns an empty rule when given no tokens', () => {
    const result = createResetStylesheet([]);
    expect(result).toBe('.reset-theme {  }');
  });

  it('returns an empty rule when given an empty token object', () => {
    const result = createResetStylesheet([{}]);
    expect(result).toBe('.reset-theme {  }');
  });

  it('sets a single token to initial', () => {
    const result = createResetStylesheet([{ color: { $value: 'red' } }]);
    expect(result).toContain('--color: initial;');
  });

  it('sets nested tokens to initial', () => {
    const result = createResetStylesheet([{ nl: { color: { red: { $value: '#f00' } } } }]);
    expect(result).toContain('--nl-color-red: initial;');
  });

  it('handles tokens identified by $type instead of $value', () => {
    const result = createResetStylesheet([{ spacing: { $type: 'dimension' } }]);
    expect(result).toContain('--spacing: initial;');
  });

  it('sets multiple tokens to initial from a single token object', () => {
    const result = createResetStylesheet([
      {
        color: { red: { $value: '#f00' } },
        font: { size: { $value: '16px' } },
      },
    ]);
    expect(result).toContain('--color-red: initial;');
    expect(result).toContain('--font-size: initial;');
  });

  it('merges tokens from multiple token objects', () => {
    const result = createResetStylesheet([{ color: { $value: 'red' } }, { spacing: { $value: '8px' } }], ':host');
    expect(result).toContain('--color: initial;');
    expect(result).toContain('--spacing: initial;');
  });

  it('deduplicates custom properties, last one stays', () => {
    const result = createResetStylesheet([{ color: { $value: 'red' } }, { color: { $value: 'blue' } }], ':host');
    expect(result.lastIndexOf('--color')).toEqual(result.indexOf('--color'));
  });

  it('wraps all declarations inside the selector block', () => {
    const result = createResetStylesheet([{ color: { $value: 'red' } }], '.theme');
    expect(result).toMatch(/^\.theme\s*\{.*\}$/s);
  });
});
