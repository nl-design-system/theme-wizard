import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { dset } from 'dset';
import { describe, expect, it } from 'vitest';
import { validateTokens } from './validate.js';

describe('validateTokens', () => {
  it('returns success for valid ma-design-tokens', () => {
    const result = validateTokens(startTokens);
    expect(result.success).toBe(true);
  });

  it('returns issues when a token has an invalid reference', () => {
    const tokens = structuredClone(startTokens);
    dset(tokens, 'basis.color.transparent.$value', '{this.does.not.exist}');
    const result = validateTokens(tokens);
    expect(result.success).toBe(false);
    if (!result.success) {
      // eslint-disable-next-line vitest/no-conditional-expect -- needed for type safety
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });

  it('returns success for tokens wrapped in a layer when excludeParentKeys is set', () => {
    const layered = { 'my-layer': structuredClone(startTokens) };
    const result = validateTokens(layered, { excludeParentKeys: true });
    expect(result.success).toBe(true);
  });

  it('returns issues for layered tokens when excludeParentKeys is not set', () => {
    const layered = { 'my-layer': structuredClone(startTokens) };
    const result = validateTokens(layered, { excludeParentKeys: false });
    expect(result.success).toBe(false);
  });
});
