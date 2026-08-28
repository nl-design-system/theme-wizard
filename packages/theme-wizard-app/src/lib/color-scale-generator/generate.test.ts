import { describe, expect, it } from 'vitest';
import type { ColorScale } from './generate.js';
import type { ProfileName, TokenName } from './masks.js';
import { apcaContrast } from './contrast.js';
import { generateScale } from './generate.js';
import { TOKENS } from './masks.js';
import { oklchToHex } from './oklch.js';

const PROFILES: ProfileName[] = ['neutral', 'accent', 'negative', 'positive', 'warning', 'highlight', 'disabled'];

/** Convert a generated token's oklch ColorValue back to hex, for assertions. */
const hexOf = (scale: ColorScale, token: TokenName): string => {
  const [L, C, H] = scale[token].components as [number, number, number];
  return oklchToHex({ C, H, L });
};

// Mirrors the README's documented contrast requirements table (APCA Lc targets).
const REQUIREMENTS: { token: TokenName; bg: TokenName; ratio: number }[] = [
  { bg: 'bg-default', ratio: 30, token: 'border-default' },
  { bg: 'bg-hover', ratio: 30, token: 'border-hover' },
  { bg: 'bg-active', ratio: 30, token: 'border-active' },
  { bg: 'bg-default', ratio: 60, token: 'color-default' },
  { bg: 'bg-hover', ratio: 60, token: 'color-hover' },
  { bg: 'bg-active', ratio: 60, token: 'color-active' },
  { bg: 'bg-subtle', ratio: 60, token: 'color-subtle' },
  { bg: 'bg-subtle', ratio: 60, token: 'color-document' },
];
// disabled uses a looser text target and disables border enforcement entirely.
const DISABLED_REQUIREMENTS = REQUIREMENTS.filter((r) => r.token.startsWith('color-')).map((r) => ({
  ...r,
  ratio: 30,
}));

describe('generateScale', () => {
  it.each(PROFILES)('produces all 14 tokens as oklch ColorValue for profile %s', (profile) => {
    const { data } = generateScale('#3366CC', { profile });
    expect(Object.keys(data).sort()).toEqual([...TOKENS].sort());
    for (const value of Object.values(data)) {
      expect(value.colorSpace).toBe('oklch');
      expect(value.components).toHaveLength(3);
    }
  });

  it.each(PROFILES)('meets default contrast requirements with no warnings for profile %s', (profile) => {
    const { data, warnings } = generateScale('#3366CC', { profile });
    expect(warnings).toEqual([]);
    const reqs = profile === 'disabled' ? DISABLED_REQUIREMENTS : REQUIREMENTS;
    for (const { bg, ratio, token } of reqs) {
      expect(Math.abs(apcaContrast(hexOf(data, bg), hexOf(data, token)))).toBeGreaterThanOrEqual(ratio - 0.1);
    }
  });

  it('generates a valid scale for both regular and inverse', () => {
    const regular = generateScale('#7C3AED', { profile: 'accent' });
    const inverse = generateScale('#7C3AED', { inverse: true, profile: 'accent' });
    expect(regular.data).not.toEqual(inverse.data);
    for (const value of Object.values(inverse.data)) {
      expect(value.colorSpace).toBe('oklch');
    }
  });

  it('accepts any valid CSS color as seed, equivalent to its hex form', () => {
    const hexSeed = generateScale('#7C3AED', { profile: 'accent' });
    const rgbSeed = generateScale('rgb(124 58 237)', { profile: 'accent' });
    const named = generateScale('rebeccapurple', { profile: 'accent' });

    expect(rgbSeed.data).toEqual(hexSeed.data);
    for (const token of TOKENS) {
      expect(hexOf(named.data, token)).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('anchor "auto" places the seed verbatim in the scale', () => {
    const { data } = generateScale('#7C3AED', { anchor: 'auto', profile: 'accent' });
    const hexes = TOKENS.map((token) => hexOf(data, token));
    expect(hexes).toContain('#7C3AED');
  });

  it('anchor to a specific token pins the seed there exactly', () => {
    const { data } = generateScale('#7C3AED', { anchor: 'color-hover', profile: 'accent' });
    expect(hexOf(data, 'color-hover')).toBe('#7C3AED');
  });

  it('throws for an unknown anchor token', () => {
    expect(() => generateScale('#7C3AED', { anchor: 'not-a-token' as TokenName, profile: 'accent' })).toThrow(
      /Unknown token/,
    );
  });

  it('chroma: 0 desaturates the whole scale', () => {
    const { data } = generateScale('#7C3AED', { chroma: 0, profile: 'accent' });
    for (const value of Object.values(data)) {
      const chroma = value.components[1];
      expect(chroma).toBeCloseTo(0, 9);
    }
  });

  it('contrast: false skips enforcement entirely (no warnings, unmodified base scale)', () => {
    // Anchoring a near-white seed to color-hover pulls the whole L ramp up
    // enough that enforcement has to nudge a token, without exceeding the
    // lightness guard (so it bumps silently, no warnings).
    const opts = { anchor: 'color-hover' as const, profile: 'accent' as const };
    const withEnforcement = generateScale('#EEEEEE', opts);
    const withoutEnforcement = generateScale('#EEEEEE', { ...opts, contrast: false });
    expect(withoutEnforcement.warnings).toEqual([]);
    expect(withEnforcement.warnings).toEqual([]);
    expect(withoutEnforcement.data).not.toEqual(withEnforcement.data);
  });

  it('contrast: { enforce: false } reports failures without changing the data', () => {
    // Lc 150 exceeds APCA's ~108 max, so some tokens must fail.
    const targets = { accent: { text: 150 } };
    const enforced = generateScale('#3366CC', { contrast: { targets }, profile: 'accent' });
    const reportOnly = generateScale('#3366CC', { contrast: { enforce: false, targets }, profile: 'accent' });
    expect(reportOnly.data).toEqual(generateScale('#3366CC', { contrast: false, profile: 'accent' }).data);
    expect(reportOnly.warnings.length).toBeGreaterThan(0);
    expect(reportOnly.data).not.toEqual(enforced.data);
  });

  it('custom targets override the defaults', () => {
    const { warnings } = generateScale('#3366CC', {
      contrast: { targets: { accent: { text: 150 } } },
      profile: 'accent',
    });
    // Lc 150 is above the achievable max; some tokens must fall short.
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('minLightnessGap widens the boundary an unreachable target stops at', () => {
    // Lc 150 is unreachable, so enforcement stops at the lightness guard and warns.
    const targets = { accent: { text: 150 } };
    const defaultGap = generateScale('#3366CC', { contrast: { targets }, profile: 'accent' });
    const widerGap = generateScale('#3366CC', { contrast: { minLightnessGap: 0.1, targets }, profile: 'accent' });
    expect(widerGap.warnings.some((warning) => warning.includes('kept 0.1 off'))).toBe(true);
    expect(widerGap.data).not.toEqual(defaultGap.data);
  });

  it('minLightnessGap: 0 lets the boundary reach pure black or white', () => {
    const targets = { accent: { text: 150 } };
    const { warnings } = generateScale('#3366CC', { contrast: { minLightnessGap: 0, targets }, profile: 'accent' });
    expect(warnings.some((warning) => /kept 0 off/.test(warning))).toBe(true);
  });

  it('minLightnessGap is clamped to the valid range (0 - 0.49)', () => {
    const targets = { accent: { text: 150 } };
    const tooLarge = generateScale('#3366CC', { contrast: { minLightnessGap: 5, targets }, profile: 'accent' });
    const atMax = generateScale('#3366CC', { contrast: { minLightnessGap: 0.49, targets }, profile: 'accent' });
    const negative = generateScale('#3366CC', { contrast: { minLightnessGap: -1, targets }, profile: 'accent' });
    const atMin = generateScale('#3366CC', { contrast: { minLightnessGap: 0, targets }, profile: 'accent' });
    expect(tooLarge.data).toEqual(atMax.data);
    expect(negative.data).toEqual(atMin.data);
  });
});
