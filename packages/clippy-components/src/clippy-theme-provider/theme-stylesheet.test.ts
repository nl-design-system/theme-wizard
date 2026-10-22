import { describe, expect, it } from 'vitest';
import { createThemeStylesheet, refToCSSVariable } from './theme-stylesheet';

describe('refToCSSVariable', () => {
  it('returns the value unchanged when it has no reference', () => {
    expect(refToCSSVariable('red')).toBe('red');
  });

  it('replaces a single-segment reference', () => {
    expect(refToCSSVariable('{color}')).toBe('var(--color)');
  });

  it('replaces a multi-segment reference, joining with hyphens', () => {
    expect(refToCSSVariable('{color.red}')).toBe('var(--color-red)');
  });

  it('replaces multiple references in the same value', () => {
    expect(refToCSSVariable('{a.b} {c.d}')).toBe('var(--a-b) var(--c-d)');
  });

  it('leaves surrounding text intact', () => {
    expect(refToCSSVariable('calc({spacing.md} * 2)')).toBe('calc(var(--spacing-md) * 2)');
  });

  it('ignores unmatched braces', () => {
    expect(refToCSSVariable('{')).toBe('{');
    expect(refToCSSVariable('}')).toBe('}');
  });
});

describe('createThemeStylesheet', () => {
  it('uses ":host" as the default selector', () => {
    const result = createThemeStylesheet({});
    expect(result).toMatch(/^:host\s*\{/);
  });

  it('uses the provided selector', () => {
    const result = createThemeStylesheet({}, '.theme');
    expect(result).toMatch(/^\.theme\s*\{/);
  });

  it('returns an empty rule when given no tokens', () => {
    expect(createThemeStylesheet({})).toBe(':host {  }');
  });

  it('sets a single token to its value', () => {
    const result = createThemeStylesheet({ color: { $type: 'color', $value: 'red' } });
    expect(result).toContain('--color: red;');
  });

  it('sets nested tokens to their value', () => {
    const result = createThemeStylesheet({ nl: { color: { red: { $type: 'color', $value: '#f00' } } } });
    expect(result).toContain('--nl-color-red: #f00;');
  });

  it('skips tokens without a $value', () => {
    const result = createThemeStylesheet({ spacing: { $type: 'dimension' } });
    expect(result).toBe(':host {  }');
  });

  it('sets multiple tokens from a single token tree', () => {
    const result = createThemeStylesheet({
      color: { red: { $type: 'color', $value: '#f00' } },
      font: { size: { $type: 'dimension', $value: '16px' } },
    });
    expect(result).toContain('--color-red: #f00;');
    expect(result).toContain('--font-size: 16px;');
  });

  it('resolves `{a.b.c}` references to `var(--a-b-c)`', () => {
    const result = createThemeStylesheet({
      color: {
        brand: { $type: 'color', $value: '{color.red}' },
        red: { $type: 'color', $value: '#f00' },
      },
    });
    expect(result).toContain('--color-brand: var(--color-red);');
  });

  it('wraps all declarations inside the selector block', () => {
    const result = createThemeStylesheet({ color: { $type: 'color', $value: 'red' } }, '.theme');
    expect(result).toMatch(/^\.theme\s*\{.*\}$/s);
  });
});
