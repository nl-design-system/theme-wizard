import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import type { TokenFile } from './types.js';
import { pipe } from './pipe.js';
import { upgradeTokens } from './upgrade.js';
import { reUseBasisTokens } from './basis.js';

const colorTokens: TokenFile = {
  color: {
    brand: {
      primary: { $type: 'color', $value: '#0070f3' },
      secondary: { $type: 'color', $value: '#7928ca' },
    },
  },
};

describe('pipe', () => {
  it('chains transforms left to right', () => {
    const legacy = {
      color: { primary: { comment: 'Brand', type: 'color', value: '#f00' } },
    } as unknown as TokenFile;

    const result = pipe(legacy, upgradeTokens, reUseBasisTokens);

    const primary = (result.color as Record<string, unknown>).primary as { $value: unknown; $description: string };
    assert.equal(typeof primary.$value, 'object'); // color string upgraded to color object
    assert.equal(primary.$description, 'Brand');
  });

  it('returns initial value unchanged when no fns are passed', () => {
    assert.deepEqual(pipe(colorTokens), colorTokens);
  });
});
