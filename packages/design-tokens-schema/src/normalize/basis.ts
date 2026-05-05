import { dequal } from 'dequal';
import dlv from 'dlv';
import { klona as deepClone } from 'klona';
import type { DTCGType, Group, Token, TokenFile } from './types.ts';
import basisData from './basis.json';
import { EXTENSION_TOKEN_SUBTYPE, assignSubTypes } from './sub-types.ts';
import { isToken, walkTokens } from './types.ts';

export interface TokenCandidate {
  /** Path of the token in `tokens` that has a hardcoded value */
  path: string[];
  token: Token;
  suggestion: {
    path: string[];
    token: Token;
  };
}

export interface MissingBasisToken {
  /** Full path including `basis` prefix, e.g. `['basis', 'border-radius', 'sm']` */
  path: string[];
  $type: DTCGType;
}

/** Returns true when a $value is an alias reference like `{some.token.path}` */
function isAliasValue(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function tokenSubType(token: Token): unknown {
  return token.$extensions?.[EXTENSION_TOKEN_SUBTYPE];
}

function valuesMatch(type: string, a: unknown, b: unknown): boolean {
  if (type === 'dimension') {
    const da = a as { value?: number; unit?: string } | null;
    const db = b as { value?: number; unit?: string } | null;
    if (da?.value === 0 && db?.value === 0) return true;
  }
  return dequal(a, b);
}

function tokensMatch(a: Token, b: Token): boolean {
  if (a.$type !== b.$type) return false;
  if (!valuesMatch(a.$type, a.$value, b.$value)) return false;
  if (tokenSubType(a) !== tokenSubType(b)) return false;
  return true;
}

/** Walk basis.json template nodes that have `$type` but no child tokens (slot nodes). */
function walkBasisSlots(
  node: Record<string, unknown>,
  fn: (path: string[], $type: DTCGType) => void,
  _path: string[] = [],
): void {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child === null || typeof child !== 'object' || Array.isArray(child)) continue;
    const childNode = child as Record<string, unknown>;
    const childPath = [..._path, key];
    const hasType = '$type' in childNode;
    const hasNonDollarChildren = Object.keys(childNode).some((k) => !k.startsWith('$'));
    if (hasType && !hasNonDollarChildren) {
      fn(childPath, childNode['$type'] as DTCGType);
    } else {
      walkBasisSlots(childNode, fn, childPath);
    }
  }
}

/**
 * Find hardcoded token values in `tokens` that could be replaced with
 * an alias reference to a basis token within the same token file.
 *
 * Basis tokens live under the top-level `basis` key. A candidate matches when:
 * - The token is not itself under `basis`
 * - `$type` is identical to a basis token
 * - `$value` is deeply equal (via dequal)
 * - `$value` is not already an alias reference (`{…}`)
 */
export function findBasisTokenCandidates(tokens: TokenFile): TokenCandidate[] {
  const typed = assignSubTypes(tokens);

  const basisFlat: Array<{ path: string[]; token: Token }> = [];
  walkTokens((typed['basis'] ?? {}) as Group, (path, token) =>
    basisFlat.push({ path: ['basis', ...path], token }),
  );

  const candidates: TokenCandidate[] = [];

  walkTokens(typed, (path, token) => {
    if (path[0] === 'basis') return;
    if (isAliasValue(token.$value)) return;

    for (const entry of basisFlat) {
      if (tokensMatch(token, entry.token)) {
        candidates.push({
          path,
          suggestion: { path: entry.path, token: deepClone(entry.token) },
          token: deepClone(token),
        });
        break; // first match per token
      }
    }
  });

  return candidates;
}

/**
 * Apply a list of `TokenCandidate` suggestions to `tokens`, replacing their
 * `$value` with an alias reference: `{path.to.basis.token}`
 */
export function applySuggestions(tokens: TokenFile, suggestions: TokenCandidate[]): TokenFile {
  const result = deepClone(tokens);

  for (const { path, suggestion } of suggestions) {
    const node = dlv(result, path) as Record<string, unknown> | undefined;
    if (node && Object.hasOwn(node, '$value')) {
      node['$value'] = `{${suggestion.path.join('.')}}`;
    }
  }

  return result;
}

/**
 * One-shot: find all matching basis tokens and replace their values with
 * alias references. Equivalent to `applySuggestions(tokens, findBasisTokenCandidates(tokens))`.
 *
 * Idempotent — already-aliased values are skipped on subsequent runs.
 */
export function reUseBasisTokens(tokens: TokenFile): TokenFile {
  return applySuggestions(tokens, findBasisTokenCandidates(tokens));
}

/**
 * Find basis token slots defined in basis.json that are absent from `tokens.basis`.
 * A slot is absent when the path does not exist or has no `$value`.
 */
export function findMissingBasisTokens(tokens: TokenFile): MissingBasisToken[] {
  const missing: MissingBasisToken[] = [];
  const template = (basisData as TokenFile)['basis'] as Record<string, unknown>;

  walkBasisSlots(template, (path, $type) => {
    const fullPath = ['basis', ...path];
    const existing = dlv(tokens, fullPath);
    if (!isToken(existing)) {
      missing.push({ $type, path: fullPath });
    }
  });

  return missing;
}

/**
 * Copy missing basis tokens from `source` into `tokens`.
 * Only paths listed in `missing` are considered; a path is filled only when
 * `source` has a real token (with `$value`) at that exact path.
 */
export function applyMissingBasisTokens(
  tokens: TokenFile,
  missing: MissingBasisToken[],
  source: TokenFile,
): TokenFile {
  const result = deepClone(tokens);

  for (const { path } of missing) {
    const sourceToken = dlv(source, path);
    if (!isToken(sourceToken)) continue;

    let node = result as Record<string, unknown>;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof node[key] !== 'object' || node[key] === null) {
        node[key] = {};
      }
      node = node[key] as Record<string, unknown>;
    }
    node[path.at(-1)!] = deepClone(sourceToken);
  }

  return result;
}

/**
 * One-shot: find all missing basis tokens and fill them from `source`.
 * Equivalent to `applyMissingBasisTokens(tokens, findMissingBasisTokens(tokens), source)`.
 */
export function fillBasisTokensFrom(tokens: TokenFile, source: TokenFile): TokenFile {
  return applyMissingBasisTokens(tokens, findMissingBasisTokens(tokens), source);
}
