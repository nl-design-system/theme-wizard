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
