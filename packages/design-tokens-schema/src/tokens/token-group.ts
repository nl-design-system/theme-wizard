import * as z from 'zod';
import { BaseDesignTokenSchema, ExtensionsSchema, type BaseDesignToken, type Extensions } from './base-token';
import { isValueObject, TokenReferenceSchema, type TokenReference } from './token-reference';

/**
 * @see https://www.designtokens.org/tr/2025.10/format/#group-properties
 */
export type TokenGroup = {
  $deprecated?: BaseDesignToken['$deprecated'];
  $description?: BaseDesignToken['$description'];
  $extends?: TokenReference;
  $extensions?: Extensions;
  $type?: BaseDesignToken['$type'];
  $value?: never;
  [key: string]: BaseDesignToken | TokenGroup | string | boolean | Extensions | undefined;
};

/**
 * Validates the well-known `$`-prefixed group properties.
 * Any other key is a nested token or a nested group, validated against `BaseDesignTokenSchema`
 * or (recursively) `TokenGroupSchema` itself via `.catchall()` (only keys not already in the
 * shape above, so the `$`-props aren't affected).
 *
 * @see https://www.designtokens.org/tr/2025.10/format/#group-properties
 */
const KNOWN_GROUP_PROPERTIES = new Set(['$deprecated', '$description', '$extends', '$extensions', '$type', '$value']);

export const TokenGroupSchema: z.ZodType<TokenGroup> = z
  .object({
    $deprecated: BaseDesignTokenSchema.shape.$deprecated,
    $description: BaseDesignTokenSchema.shape.$description,
    // TokenReferenceSchema's output is typed as a plain `string`, so brand it back to `TokenReference`
    $extends: TokenReferenceSchema.transform((ref): TokenReference => ref as TokenReference).optional(),
    $extensions: ExtensionsSchema.optional(),
    $type: BaseDesignTokenSchema.shape.$type.optional(),
    // A group must not have a `$value`, that would make it a token instead
    $value: z.never().optional(),
  })
  // Other properties are either a design token, or a nested token group
  .catchall(z.union([BaseDesignTokenSchema, z.lazy(() => TokenGroupSchema)]))
  // `.catchall()` only validates the *value* of unknown keys, not their name, so an
  // unrecognized `$`-prefixed key (e.g. a typo like `$extens`) would otherwise slip through
  // as if it were a nested token/group.
  .superRefine((group, ctx) => {
    for (const key of Object.keys(group)) {
      if (key.startsWith('$') && !KNOWN_GROUP_PROPERTIES.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: `Unknown group property "${key}"`,
          path: [key],
        });
      }
    }
  });

export const isTokenGroup = (obj: unknown): obj is TokenGroup => {
  if (!isValueObject(obj)) {
    return false;
  }

  return TokenGroupSchema.safeParse(obj).success;
};

export const getGroupTokens = (tokenGroup: TokenGroup): BaseDesignToken[] => {
  const tokens: BaseDesignToken[] = [];

  for (const [key, tokenOrGroup] of Object.entries(tokenGroup)) {
    if (KNOWN_GROUP_PROPERTIES.has(key)) {
      continue;
    }
    if (isValueObject(tokenOrGroup) && Object.hasOwn(tokenOrGroup, '$value')) {
      tokens.push(tokenOrGroup as BaseDesignToken);
    }
  }

  return tokens;
};

export const getTokenGroupType = (tokenGroup: TokenGroup): TokenGroup['$type'] => {
  // Not an object, or it has a `$value` of its own (making it a token, not a group)
  if (!isValueObject(tokenGroup) || Object.hasOwn(tokenGroup, '$value')) {
    return undefined;
  }

  // Return the group's $type if present
  if (Object.hasOwn(tokenGroup, '$type')) {
    return tokenGroup.$type;
  }

  const tokens = getGroupTokens(tokenGroup);
  let firstType: TokenGroup['$type'];

  // All $types must match
  for (const token of tokens) {
    // No $type present: token inherits $type from group
    if (!Object.hasOwn(token, '$type')) {
      continue;
    }

    // No $type known yet for this group, so define it here
    if (firstType === undefined) {
      firstType = token.$type;
      continue;
    }

    // Explicit $type set on the token: must match the other $types in the group
    if (token.$type !== firstType) {
      return undefined;
    }
  }

  return firstType;
};

/**
 *
 */
export const isTokenGroupOfType = <T extends TokenGroup['$type']>(
  tokenGroup: TokenGroup,
  $type: T,
): tokenGroup is TokenGroup & { $type: T } => {
  return getTokenGroupType(tokenGroup) === $type;
};
