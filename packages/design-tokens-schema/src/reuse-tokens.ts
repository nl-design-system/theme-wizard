/**
 * Basis token reuse — find and apply replacement suggestions.
 *
 * Component tokens with hard-coded values (e.g. `{ value: 4, unit: 'px' }`) that
 * match a basis token should instead reference it (`{basis.space.block.xs}`), so
 * the component inherits future basis scale changes automatically.
 *
 * **Pre-condition:** input must have passed through `preprocessThemeStrict()` —
 * refs resolved, legacy formats upgraded, subtypes assigned.
 *
 * **Matching:** two tokens are equivalent when their *match key* and `$value` agree.
 * The match key is `EXTENSION_TOKEN_SUBTYPE` when set (more specific than `$type`
 * alone — a `'space-block'` and a `'font-size'` dimension must never be swapped),
 * falling back to `$type` for types that never receive a subtype (e.g. `fontFamily`).
 * When multiple basis tokens share the same key + value, the first walk-order hit wins.
 */

import { dequal } from 'dequal';
import { dset } from 'dset';
import { BaseDesignToken, TokenPath } from './tokens/base-token';
import { isRef, createReference } from './tokens/token-reference';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';
import { walkTokens } from './walker';

/**
 * A component token paired with the basis token it could reference instead.
 * `path` / `suggestion.path` are absolute paths in the tree.
 */
export type TokenCandidate = {
  path: TokenPath;
  token: BaseDesignToken;
  suggestion: {
    path: TokenPath;
    token: BaseDesignToken;
  };
};

/** Basis token with its absolute path, used as the candidate pool. */
type BasisEntry = { path: TokenPath; token: BaseDesignToken };

/** Subtype when set, otherwise `$type` as fallback (e.g. for `fontFamily`). */
const matchKey = (token: BaseDesignToken): string =>
  (token.$extensions?.[EXTENSION_TOKEN_SUBTYPE] as string | undefined) ?? token.$type;

/** Collects all basis tokens with resolved (non-ref) values into a flat list. */
const collectBasisTokens = (root: Record<string, unknown>): BasisEntry[] => {
  const entries: BasisEntry[] = [];
  const basis = root['basis'];
  if (!basis || typeof basis !== 'object') return entries;

  walkTokens(basis, (token, path) => {
    if (isRef(token.$value)) {
      return; // do not attempt to re-use refs
    }
    entries.push({ path: ['basis', ...path], token });
  });

  return entries;
};

/**
 * Returns component tokens whose hard-coded `$value` matches a basis token.
 * Skips basis-namespace tokens and tokens whose `$value` is already a reference.
 * Does not mutate `tokens`.
 */
export const findReusableTokens = (tokens: Record<string, unknown>): TokenCandidate[] => {
  const basisEntries = collectBasisTokens(tokens);
  const candidates: TokenCandidate[] = [];

  walkTokens(tokens, (token, path) => {
    if (path[0] === 'basis') {
      return; // do not optimize basis itself
    }
    if (isRef(token.$value)) {
      return; // nothing to suggest
    }

    const key = matchKey(token);
    const match = basisEntries.find(
      ({ token: basisToken }) => matchKey(basisToken) === key && dequal(basisToken.$value, token.$value),
    );
    if (match === undefined) {
      return; // values are not a match
    }

    candidates.push({ path: [...path], suggestion: match, token });
  });

  return candidates;
};

/**
 * Replaces each candidate's hard-coded `$value` with a reference to the suggested
 * basis token. Returns a deep clone — `tokens` is never mutated.
 */
export const applyReusableTokens = (
  tokens: Record<string, unknown>,
  candidates: TokenCandidate[],
): Record<string, unknown> => {
  const result = structuredClone(tokens);
  for (const { path, suggestion } of candidates) {
    dset(result, [...path, '$value'], createReference(suggestion.path));
  }
  return result;
};

/** Shorthand for `applyReusableCandidates(tokens, findReusableCandidates(tokens))`. */
export const reuseBasisTokens = (tokens: Record<string, unknown>): Record<string, unknown> => {
  const candidates = findReusableTokens(tokens);
  return applyReusableTokens(tokens, candidates);
};
