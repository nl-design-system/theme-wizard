import { merge } from 'es-toolkit';

type TokenGroup = Record<string, unknown>;

/**
 * Basically a copy of es-toolkit's merge() but for design token groups specifically
 */
export const mergeTokens = (tokenGroups: TokenGroup[]): TokenGroup =>
  tokenGroups.reduce<TokenGroup>((acc, group) => merge(acc, group), Object.create(null));
