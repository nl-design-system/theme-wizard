import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from './contrast.js';

describe('relativeLuminance', () => {
  it('is 1 for white and 0 for black', () => {
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 9);
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 9);
  });

  it('matches the WCAG mid-gray reference value', () => {
    // #767676 is the canonical "just passes 4.5:1 on white" WCAG example color.
    expect(relativeLuminance('#767676')).toBeCloseTo(0.1812, 3);
  });
});

describe('contrastRatio', () => {
  it('is 21:1 between black and white, order-independent', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 9);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 9);
  });

  it('is 1:1 for a color against itself', () => {
    expect(contrastRatio('#7C3AED', '#7C3AED')).toBeCloseTo(1, 9);
  });

  it('matches the WCAG mid-gray-on-white reference ratio (~4.54:1)', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.5422, 3);
  });
});
