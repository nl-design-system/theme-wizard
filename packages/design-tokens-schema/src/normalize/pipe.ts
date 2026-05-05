import type { TokenFile } from './types.js';

/**
 * Pipe a TokenFile through a series of transform functions.
 *
 * Each function receives the output of the previous one.
 * Functions can be unary (just tokens) or binary (tokens + extra arg) —
 * for binary functions, partially apply them first.
 *
 * @example
 * const result = pipe(
 *   mergeTokens(buttonTokens, linkTokens).tokens,
 *   upgradeTokens,
 *   (t) => completeTokens(t, startTokens),
 *   (t) => reUseBasisTokens(t, basisTokens),
 * );
 */
export function pipe(initial: TokenFile, ...fns: Array<(tokens: TokenFile) => TokenFile>): TokenFile {
  return fns.reduce((tokens, fn) => fn(tokens), initial);
}
