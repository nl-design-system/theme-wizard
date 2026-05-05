import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import type { TokenFile } from './types.js';
import { mergeTokens } from './merge.js';

const colorTokens: TokenFile = {
  color: {
    brand: {
      primary: { $type: 'color', $value: '#0070f3' },
      secondary: { $type: 'color', $value: '#7928ca' },
    },
  },
};

const spacingTokens: TokenFile = {
  spacing: {
    md: { $type: 'dimension', $value: { unit: 'px', value: 8 } },
    sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } },
  },
};

describe('mergeTokens', () => {
  it('merges distinct token trees', () => {
    const result = mergeTokens(colorTokens, spacingTokens);
    assert.ok(Object.hasOwn(result, 'color'));
    assert.ok(Object.hasOwn(result, 'spacing'));
  });

  it('merges nested groups from two files', () => {
    const a: TokenFile = { color: { red: { $type: 'color', $value: '#f00' } } };
    const b: TokenFile = { color: { blue: { $type: 'color', $value: '#00f' } } };
    const result = mergeTokens(a, b);
    const color = result['color'] as Record<string, unknown>;
    assert.ok(Object.hasOwn(color, 'red') && Object.hasOwn(color, 'blue'));
  });

  it('last file wins on token conflict', () => {
    const a: TokenFile = { color: { primary: { $type: 'color', $value: '#f00' } } };
    const b: TokenFile = { color: { primary: { $type: 'color', $value: '#00f' } } };
    const primary = (mergeTokens(a, b)['color'] as Record<string, unknown>)['primary'] as { $value: string };
    assert.equal(primary.$value, '#00f');
  });

  it('does not mutate inputs', () => {
    const a: TokenFile = { color: { primary: { $type: 'color', $value: '#f00' } } };
    const b: TokenFile = { color: { primary: { $type: 'color', $value: '#00f' } } };
    mergeTokens(a, b);
    assert.equal(((a.color as Record<string, unknown>).primary as { $value: string }).$value, '#f00');
  });
});
