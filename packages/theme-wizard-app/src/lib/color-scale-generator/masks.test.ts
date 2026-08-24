import { describe, expect, it } from 'vitest';
import type { ProfileName } from './masks.js';
import { MASKS, TOKENS } from './masks.js';

const PROFILES = Object.keys(MASKS) as ProfileName[];

describe('MASKS', () => {
  it('has 14 tokens', () => {
    expect(TOKENS).toHaveLength(14);
  });

  it.each(PROFILES)('%s has a regular and inverse variant', (profile) => {
    expect(MASKS[profile]).toHaveProperty('regular');
    expect(MASKS[profile]).toHaveProperty('inverse');
  });

  it.each(PROFILES.flatMap((profile) => [[profile, 'regular'] as const, [profile, 'inverse'] as const]))(
    '%s/%s has one L/C/H value per token, and a token seedSlot',
    (profile, variant) => {
      const mask = MASKS[profile][variant];
      expect(mask.L).toHaveLength(TOKENS.length);
      expect(mask.C).toHaveLength(TOKENS.length);
      expect(mask.H).toHaveLength(TOKENS.length);
      expect(TOKENS).toContain(mask.seedSlot);
    },
  );

  it.each(PROFILES.flatMap((profile) => [[profile, 'regular'] as const, [profile, 'inverse'] as const]))(
    '%s/%s has L and C values within their valid OKLCH ranges',
    (profile, variant) => {
      const mask = MASKS[profile][variant];
      for (const L of mask.L) {
        expect(L).toBeGreaterThanOrEqual(0);
        expect(L).toBeLessThanOrEqual(1);
      }
      for (const C of mask.C) {
        expect(C).toBeGreaterThanOrEqual(0);
      }
      expect(mask.peakC).toBeGreaterThanOrEqual(0);
    },
  );
});
