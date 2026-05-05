import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import type { TokenFile } from './types.js';
import {
  findBasisTokenCandidates,
  applySuggestions,
  reUseBasisTokens,
  findMissingBasisTokens,
  applyMissingBasisTokens,
  fillBasisTokensFrom,
} from './basis.js';
import { mergeTokens } from './merge.js';

const basisTokens: TokenFile = {
  basis: {
    'border-radius': {
      sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } },
      square: { $type: 'dimension', $value: { unit: 'px', value: 0 } },
    },
    color: {
      brand: { $type: 'color', $value: '#0070f3' },
    },
  },
};

// ---------------------------------------------------------------------------
// findBasisTokenCandidates
// ---------------------------------------------------------------------------

describe('findBasisTokenCandidates', () => {
  it('finds a token matching by $type and $value', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      utrecht: { button: { 'border-radius': { $type: 'dimension', $value: { unit: 'px', value: 0 } } } },
    });
    const candidates = findBasisTokenCandidates(tokens);
    assert.equal(candidates.length, 1);
    assert.deepEqual(candidates[0].path, ['utrecht', 'button', 'border-radius']);
    assert.deepEqual(candidates[0].suggestion.path, ['basis', 'border-radius', 'square']);
  });

  it('skips tokens whose $value is already an alias reference', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      token: { $type: 'dimension', $value: '{basis.border-radius.square}' },
    });
    assert.equal(findBasisTokenCandidates(tokens).length, 0);
  });

  it('does not match when $type differs', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      token: { $type: 'number', $value: { unit: 'px', value: 0 } },
    });
    assert.equal(findBasisTokenCandidates(tokens).length, 0);
  });

  it('does not match when $value differs', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      token: { $type: 'dimension', $value: { unit: 'px', value: 99 } },
    });
    assert.equal(findBasisTokenCandidates(tokens).length, 0);
  });

  it('returns empty when nothing matches', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, { token: { $type: 'color', $value: '#unique' } });
    assert.equal(findBasisTokenCandidates(tokens).length, 0);
  });

  it('matches dimension with value 0 regardless of unit', () => {
    const tokens: TokenFile = {
      basis: { square: { $type: 'dimension', $value: { unit: 'px', value: 0 } } },
      token: { $type: 'dimension', $value: { unit: 'rem', value: 0 } },
    };
    const candidates = findBasisTokenCandidates(tokens);
    assert.equal(candidates.length, 1);
    assert.deepEqual(candidates[0].suggestion.path, ['basis', 'square']);
  });

  it('does not match dimension when only one value is 0', () => {
    const tokens: TokenFile = {
      basis: { sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } } },
      token: { $type: 'dimension', $value: { unit: 'px', value: 0 } },
    };
    assert.equal(findBasisTokenCandidates(tokens).length, 0);
  });

  it('does not suggest a basis token as a candidate for itself', () => {
    assert.equal(findBasisTokenCandidates(basisTokens).length, 0);
  });
});

// ---------------------------------------------------------------------------
// applySuggestions
// ---------------------------------------------------------------------------

describe('applySuggestions', () => {
  it('replaces $value with alias reference string', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      button: { 'border-radius': { $type: 'dimension', $value: { unit: 'px', value: 0 } } },
    });
    const result = applySuggestions(tokens, findBasisTokenCandidates(tokens));
    const token = (result.button as Record<string, unknown>)['border-radius'] as { $value: string };
    assert.equal(token.$value, '{basis.border-radius.square}');
  });

  it('does not mutate the input', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      button: { 'border-radius': { $type: 'dimension', $value: { unit: 'px', value: 0 } } },
    });
    applySuggestions(tokens, findBasisTokenCandidates(tokens));
    const orig = (tokens['button'] as Record<string, unknown>)['border-radius'] as { $value: unknown };
    assert.deepEqual(orig.$value, { unit: 'px', value: 0 });
  });
});

// ---------------------------------------------------------------------------
// reUseBasisTokens
// ---------------------------------------------------------------------------

describe('reUseBasisTokens', () => {
  it('is equivalent to findBasisTokenCandidates + applySuggestions', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      button: { 'border-radius': { $type: 'dimension', $value: { unit: 'px', value: 0 } } },
    });
    assert.deepEqual(
      reUseBasisTokens(tokens),
      applySuggestions(tokens, findBasisTokenCandidates(tokens)),
    );
  });

  it('is idempotent', () => {
    const tokens: TokenFile = mergeTokens(basisTokens, {
      button: { 'border-radius': { $type: 'dimension', $value: { unit: 'px', value: 0 } } },
    });
    const once = reUseBasisTokens(tokens);
    assert.deepEqual(once, reUseBasisTokens(once));
  });
});

// ---------------------------------------------------------------------------
// findMissingBasisTokens
// ---------------------------------------------------------------------------

describe('findMissingBasisTokens', () => {
  it('reports a slot absent from tokens.basis', () => {
    const missing = findMissingBasisTokens({});
    assert.ok(missing.length > 0);
    assert.ok(missing.every((m) => m.path[0] === 'basis'));
    assert.ok(missing.every((m) => typeof m.$type === 'string'));
  });

  it('does not report a slot that is present', () => {
    const tokens: TokenFile = {
      basis: { 'border-radius': { square: { $type: 'dimension', $value: { unit: 'px', value: 0 } } } },
    };
    const missing = findMissingBasisTokens(tokens);
    const paths = new Set(missing.map((m) => m.path.join('.')));
    assert.ok(!paths.has('basis.border-radius.square'));
  });

  it('returns empty array when all basis slots are filled', () => {
    // Build a tokens object by filling from itself — after fill it should be complete
    const source: TokenFile = {
      basis: {
        'border-radius': {
          lg: { $type: 'dimension', $value: { unit: 'px', value: 16 } },
          md: { $type: 'dimension', $value: { unit: 'px', value: 8 } },
          round: { $type: 'dimension', $value: { unit: 'px', value: 9999 } },
          sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } },
          square: { $type: 'dimension', $value: { unit: 'px', value: 0 } },
        },
      },
    };
    const filled = fillBasisTokensFrom({}, source);
    const stillMissing = findMissingBasisTokens(filled);
    const paths = new Set(stillMissing.map((m) => m.path.join('.')));
    assert.ok(!paths.has('basis.border-radius.square'));
    assert.ok(!paths.has('basis.border-radius.sm'));
  });
});

// ---------------------------------------------------------------------------
// applyMissingBasisTokens
// ---------------------------------------------------------------------------

describe('applyMissingBasisTokens', () => {
  it('copies a token from source into target at the missing path', () => {
    const source: TokenFile = {
      basis: { 'border-radius': { sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } } } },
    };
    const missing = findMissingBasisTokens({});
    const result = applyMissingBasisTokens({}, missing, source);
    const sm = (result['basis'] as Record<string, unknown>)?.['border-radius'] as Record<string, unknown>;
    assert.deepEqual(sm?.['sm'], { $type: 'dimension', $value: { unit: 'px', value: 4 } });
  });

  it('skips paths absent from source', () => {
    const missing = findMissingBasisTokens({});
    const result = applyMissingBasisTokens({}, missing, {});
    assert.deepEqual(result, {});
  });

  it('does not mutate input tokens', () => {
    const tokens: TokenFile = {};
    const source: TokenFile = {
      basis: { 'border-radius': { sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } } } },
    };
    applyMissingBasisTokens(tokens, findMissingBasisTokens(tokens), source);
    assert.deepEqual(tokens, {});
  });

  it('does not overwrite an existing token', () => {
    const tokens: TokenFile = {
      basis: { 'border-radius': { sm: { $type: 'dimension', $value: { unit: 'px', value: 99 } } } },
    };
    const source: TokenFile = {
      basis: { 'border-radius': { sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } } } },
    };
    const missing = findMissingBasisTokens(tokens);
    const result = applyMissingBasisTokens(tokens, missing, source);
    const sm = (result['basis'] as Record<string, unknown>)?.['border-radius'] as Record<string, unknown>;
    assert.deepEqual(sm?.['sm'], { $type: 'dimension', $value: { unit: 'px', value: 99 } });
  });
});

// ---------------------------------------------------------------------------
// fillBasisTokensFrom
// ---------------------------------------------------------------------------

describe('fillBasisTokensFrom', () => {
  it('is equivalent to applyMissingBasisTokens(tokens, findMissingBasisTokens(tokens), source)', () => {
    const tokens: TokenFile = {};
    const source: TokenFile = {
      basis: { 'border-radius': { sm: { $type: 'dimension', $value: { unit: 'px', value: 4 } } } },
    };
    assert.deepEqual(
      fillBasisTokensFrom(tokens, source),
      applyMissingBasisTokens(tokens, findMissingBasisTokens(tokens), source),
    );
  });
});
