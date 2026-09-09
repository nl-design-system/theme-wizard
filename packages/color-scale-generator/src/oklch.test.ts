import { describe, expect, it } from 'vitest';
import { clampChroma, oklchToHex, parseToOklch } from './oklch.js';

describe('parseToOklch', () => {
  it('parses a hex color', () => {
    const { C, H, L } = parseToOklch('#7C3AED');
    expect(L).toBeCloseTo(0.5413, 3);
    expect(C).toBeCloseTo(0.2466, 3);
    expect(H).toBeCloseTo(293.009, 2);
  });

  it('parses rgb(), hsl(), oklch() and named colors to the same space', () => {
    const hex = parseToOklch('#7C3AED');
    const rgb = parseToOklch('rgb(124 58 237)');
    expect(rgb.L).toBeCloseTo(hex.L, 9);
    expect(rgb.C).toBeCloseTo(hex.C, 9);
    expect(rgb.H).toBeCloseTo(hex.H, 9);

    const named = parseToOklch('rebeccapurple');
    expect(named.L).toBeCloseTo(0.4403, 3);

    const oklch = parseToOklch('oklch(0.5 0.2 280)');
    expect(oklch.L).toBeCloseTo(0.5, 9);
    expect(oklch.C).toBeCloseTo(0.2, 9);
    expect(oklch.H).toBeCloseTo(280, 9);
  });

  it('returns hue 0 (not NaN/null) for achromatic colors', () => {
    expect(parseToOklch('#808080').H).toBe(0);
    expect(parseToOklch('#FFFFFF').H).toBe(0);
    expect(parseToOklch('#000000').H).toBe(0);
  });

  it('white and black have C close to 0 and L at the extremes', () => {
    const white = parseToOklch('#FFFFFF');
    expect(white.C).toBeCloseTo(0, 6);
    expect(white.L).toBeCloseTo(1, 3);

    const black = parseToOklch('#000000');
    expect(black.C).toBeCloseTo(0, 6);
    expect(black.L).toBeCloseTo(0, 3);
  });
});

describe('oklchToHex', () => {
  it('round-trips a hex color through OKLCH', () => {
    const oklch = parseToOklch('#7C3AED');
    expect(oklchToHex(oklch)).toBe('#7C3AED');
  });

  it('encodes pure black and white', () => {
    expect(oklchToHex({ C: 0, H: 0, L: 0 })).toBe('#000000');
    expect(oklchToHex({ C: 0, H: 0, L: 1 })).toBe('#FFFFFF');
  });

  it('always returns an uppercase 6-digit hex string', () => {
    const hex = oklchToHex({ C: 0.1, H: 200, L: 0.6 });
    expect(hex).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('clamps out-of-gamut channels instead of producing invalid hex', () => {
    // Wildly out-of-gamut chroma for this L/H — channels would overflow [0,1].
    const hex = oklchToHex({ C: 5, H: 30, L: 0.5 });
    expect(hex).toMatch(/^#[0-9A-F]{6}$/);
  });
});

describe('clampChroma', () => {
  it('leaves in-gamut chroma unchanged', () => {
    const { C, H, L } = parseToOklch('#7C3AED');
    expect(clampChroma(L, C, H)).toBeCloseTo(C, 9);
  });

  it('shrinks out-of-gamut chroma to the gamut boundary (idempotent)', () => {
    const clamped = clampChroma(0.5, 5, 30);
    expect(clamped).toBeLessThan(5);
    expect(clamped).toBeGreaterThanOrEqual(0);
    // Already in gamut: clamping again should be a no-op.
    expect(clampChroma(0.5, clamped, 30)).toBeCloseTo(clamped, 6);
  });

  it('zero chroma is always in gamut', () => {
    expect(clampChroma(0.5, 0, 123)).toBe(0);
  });
});
