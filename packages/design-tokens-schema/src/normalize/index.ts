export type { DTCGType, DimensionValue, Token, Group, TokenFile } from './types.ts';
export { isToken, isGroup, walkTokens } from './types.ts';

export { mergeTokens } from './merge.ts';

export type { UpgradeOptions } from './upgrade.ts';
export { upgradeTokens, parseDimension, parseFontFamily } from './upgrade.ts';

export type { TokenCandidate, MissingBasisToken } from './basis.ts';
export {
  findBasisTokenCandidates,
  applySuggestions,
  reUseBasisTokens,
  findMissingBasisTokens,
  applyMissingBasisTokens,
  fillBasisTokensFrom,
} from './basis.ts';

export { pipe } from './pipe.ts';

export type { SubType } from './sub-types.ts';
export { EXTENSION_TOKEN_SUBTYPE, getTokenSubType, assignSubTypes } from './sub-types.ts';

import type { TokenFile } from './types.ts';
import { reUseBasisTokens } from './basis.ts';
import { mergeTokens } from './merge.ts';
import { pipe } from './pipe.ts';
import { assignSubTypes } from './sub-types.ts';
import { upgradeTokens } from './upgrade.ts';

export interface NormalizeOptions {
  upgrade?: boolean;
  assignSubTypes?: boolean;
  reuseBasis?: boolean;
}

export function normalize(inputs: TokenFile[], options: NormalizeOptions = {}): TokenFile {
  const merged = inputs.length > 1 ? mergeTokens(...inputs) : inputs[0];
  const transforms: Array<(t: TokenFile) => TokenFile> = [];

  if (options.upgrade) transforms.push(upgradeTokens);
  // assignSubTypes must run before reuseBasis for subtype-aware matching
  if (options.assignSubTypes || options.reuseBasis) transforms.push(assignSubTypes);
  if (options.reuseBasis) transforms.push(reUseBasisTokens);

  return transforms.length > 0 ? pipe(merged, ...transforms) : merged;
}
