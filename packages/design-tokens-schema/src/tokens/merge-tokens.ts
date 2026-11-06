import { mergeWith } from 'es-toolkit';
import { isValueToken } from './token-reference';

type TokenGroup = Record<string, unknown>;

/**
 * Deep merges design token groups. A token in a later group replaces the earlier token as a whole,
 * so stale metadata (e.g. Style Dictionary's `original.$value`) can't leak into the result.
 * Only `$type` is inherited from the earlier token when the later one lacks it.
 */
export const mergeTokens = (tokenGroups: TokenGroup[]): TokenGroup =>
  tokenGroups.reduce<TokenGroup>(
    (acc, group) =>
      mergeWith(acc, group, (target, source) => {
        if (!isValueToken(source)) {
          return undefined;
        }
        const token = structuredClone(source);
        // Keep an earlier `$type` so a typeless override still validates
        if (!Object.hasOwn(token, '$type') && isValueToken(target) && Object.hasOwn(target, '$type')) {
          token['$type'] = target['$type'];
        }
        return token;
      }),
    Object.create(null),
  );
