import { SKIP, stringifyToken, walkTokens } from '@nl-design-system-community/design-tokens-schema';

export const localeCompare = new Intl.Collator('en').compare;

/** Flattens a design token tree into `path -> stringified $value` for leaf tokens only, ignoring `$extensions`. */
const flattenTokenValues = (tokens: unknown): Map<string, string> => {
  const values = new Map<string, string>();
  walkTokens(tokens, (token, path) => {
    values.set(path.join('.'), stringifyToken(token));
    return SKIP;
  });
  return values;
};

/** Token paths whose `$value` differs (added, removed, or changed) between two token trees. */
export const diffDesignTokenPaths = (before: unknown, after: unknown): string[] => {
  const beforeValues = flattenTokenValues(before);
  const afterValues = flattenTokenValues(after);
  const paths = new Set(beforeValues.keys()).union(new Set(afterValues.keys()));

  return [...paths].filter((path) => beforeValues.get(path) !== afterValues.get(path)).sort(localeCompare);
};
