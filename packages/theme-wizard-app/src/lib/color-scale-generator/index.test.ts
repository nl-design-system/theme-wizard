import { describe, expect, it } from 'vitest';
import * as ColorScaleGenerator from './index.js';

describe('index exports', () => {
  it('exports the public API', () => {
    expect(ColorScaleGenerator.generateScale).toBeTypeOf('function');
    expect(ColorScaleGenerator.parseToOklch).toBeTypeOf('function');
    expect(ColorScaleGenerator.oklchToHex).toBeTypeOf('function');
    expect(ColorScaleGenerator.clampChroma).toBeTypeOf('function');
    expect(ColorScaleGenerator.contrastRatio).toBeTypeOf('function');
    expect(ColorScaleGenerator.relativeLuminance).toBeTypeOf('function');
    expect(ColorScaleGenerator.TOKENS).toHaveLength(14);
    expect(Object.keys(ColorScaleGenerator.MASKS).sort()).toEqual(
      ['accent', 'disabled', 'highlight', 'negative', 'neutral', 'positive', 'warning'].sort(),
    );
  });

  it('generateScale works end-to-end through the barrel', () => {
    const { data, warnings } = ColorScaleGenerator.generateScale('#7C3AED', { profile: 'accent' });
    expect(warnings).toEqual([]);
    expect(data['border-active']).toMatch(/^#[0-9A-F]{6}$/);
  });
});
