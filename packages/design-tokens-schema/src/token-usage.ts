import dlv from 'dlv';
import { setExtension } from './extensions';
import { ThemeLike } from './theme';
import { extractRef, isTokenLike } from './tokens/token-reference';
import { walkTokensWithRef } from './walker';

/**
 * Create a Map of which other tokens reference each token, keyed by referenced token id,
 * with values being the dot-joined paths of tokens that reference it.
 */
export const countUsagePerToken = (tokens: ThemeLike): Map<string, string[]> => {
  const tokenUsage = new Map<string, string[]>();
  walkTokensWithRef(tokens, tokens, (token, path) => {
    const tokenId = extractRef(token.$value);
    if (path.includes('$extensions')) {
      return;
    }
    const stored = tokenUsage.get(tokenId) || [];
    stored.push(path.join('.'));
    tokenUsage.set(tokenId, stored);
  });
  return tokenUsage;
};

export const EXTENSION_REFERENCED_AT = 'nl.nldesignsystem.referenced-at';
export const EXTENSION_REFERENCE_COUNT = 'nl.nldesignsystem.reference-count';

export const addTokenCountExtensions = (tokens: ThemeLike): ThemeLike => {
  const usage = countUsagePerToken(tokens);

  for (const [tokenId, usages] of usage) {
    const token = dlv(tokens, tokenId);
    if (!isTokenLike(token)) {
      continue;
    }
    setExtension(token, EXTENSION_REFERENCED_AT, usages);
    setExtension(token, EXTENSION_REFERENCE_COUNT, usages.length);
  }

  return tokens;
};
