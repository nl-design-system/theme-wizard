import { describe, expect, it } from 'vitest';
import type { ColorScale } from './generate.js';
import type { ProfileName, TokenName } from './masks.js';
import { contrastRatio } from './contrast.js';
import { generateScale } from './generate.js';
import { TOKENS } from './masks.js';
import { oklchToHex } from './oklch.js';

const PROFILES: ProfileName[] = ['neutral', 'accent', 'negative', 'positive', 'warning', 'highlight', 'disabled'];

/** Convert a generated token's oklch ColorValue back to hex, for assertions. */
const hexOf = (scale: ColorScale, token: TokenName): string => {
  const [L, C, H] = scale[token].components as [number, number, number];
  return oklchToHex({ C, H, L });
};

// Mirrors the README's documented contrast requirements table.
const REQUIREMENTS: { token: TokenName; bg: TokenName; ratio: number }[] = [
  { bg: 'bg-default', ratio: 3, token: 'border-default' },
  { bg: 'bg-hover', ratio: 3, token: 'border-hover' },
  { bg: 'bg-active', ratio: 3, token: 'border-active' },
  { bg: 'bg-default', ratio: 4.5, token: 'color-default' },
  { bg: 'bg-hover', ratio: 4.5, token: 'color-hover' },
  { bg: 'bg-active', ratio: 4.5, token: 'color-active' },
  { bg: 'bg-subtle', ratio: 4.5, token: 'color-subtle' },
  { bg: 'bg-subtle', ratio: 4.5, token: 'color-document' },
];
// disabled uses a looser text target and disables border enforcement entirely.
const DISABLED_REQUIREMENTS = REQUIREMENTS.filter((r) => r.token.startsWith('color-')).map((r) => ({
  ...r,
  ratio: 3,
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
      expect(contrastRatio(hexOf(data, token), hexOf(data, bg))).toBeGreaterThanOrEqual(ratio - 0.01);
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
    // An unreachably high target (21:1) guarantees some tokens fail.
    const targets = { accent: { text: 21 } };
    const enforced = generateScale('#3366CC', { contrast: { targets }, profile: 'accent' });
    const reportOnly = generateScale('#3366CC', { contrast: { enforce: false, targets }, profile: 'accent' });
    expect(reportOnly.data).toEqual(generateScale('#3366CC', { contrast: false, profile: 'accent' }).data);
    expect(reportOnly.warnings.length).toBeGreaterThan(0);
    expect(reportOnly.data).not.toEqual(enforced.data);
  });

  it('custom targets override the defaults', () => {
    const { warnings } = generateScale('#3366CC', {
      contrast: { targets: { accent: { text: 21 } } },
      profile: 'accent',
    });
    // 21:1 is only achievable by pure black-on-white; some tokens must fall short.
    expect(warnings.length).toBeGreaterThan(0);
  });
});
