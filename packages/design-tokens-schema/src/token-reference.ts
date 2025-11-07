import dlv from 'dlv';
import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema } from './base-token';

// A Design Token ref:
// - Starts with {
// - Ends with }
// - Contains only BaseDesignTokenNameSchema, joined by a . character
export const TokenReferenceSchema = z
  .string()
  .trim()
  .startsWith('{')
  .endsWith('}')
  .transform((value) => {
    return value
      .slice(1, -1) // remove { and }
      .split('.'); // Get the individual parts
  })
  // Validate that each part is a valid identifier
  .pipe(z.array(BaseDesignTokenIdentifierSchema))
  // Join them back together
  .transform((value) => `{${value.join('.')}}`);

export type TokenReference = z.infer<typeof TokenReferenceSchema>;

const TokenWithRefSchema = z.looseObject({
  $extensions: z.record(z.string(), z.unknown()).optional(),
  $type: z.string(),
  $value: TokenReferenceSchema,
});
export type TokenWithRef = z.infer<typeof TokenWithRefSchema>;

const ReferencedTokenSchema = z.looseObject({
  $type: z.string(),
  $value: z.unknown(),
});

/**
 * A predicate function that checks if a given ref in our schema is valid.
 * Note that it either throws an error or returns a boolean:
 * This is because it's used both as a Zod validation as well as a regular predicate.
 *
 * @param data A part of the root config in which refs may be present
 * @param root The root of the config in which tokens are searched
 */
export const isTokenWithRef = (data: unknown, root?: Record<string, unknown>): data is TokenWithRef => {
  // Check that we're dealing with a token-like object
  const parsedSource = TokenWithRefSchema.safeParse(data);
  if (parsedSource.success === false) {
    return false;
  }

  // Grab the `{path.to.ref} -> path.to.ref` and find it inside root
  const refPath = parsedSource.data.$value.slice(1, -1);
  const ref = dlv(root, refPath) || dlv(root, `brand.${refPath}`) || dlv(root, `common.${refPath}`);

  // Check that we're dealing with a token-like object
  const parsedRef = ReferencedTokenSchema.safeParse(ref);
  if (parsedRef.success === false) {
    throw new Error(`Invalid token reference: expected "${refPath}" to have a "$value" and "$type" property`);
  }

  // make sure the $type of the referenced token is the same
  if (parsedSource.data.$type !== parsedRef.data.$type) {
    throw new Error(
      `Invalid token reference: $type "${parsedSource.data['$type']}" of "${JSON.stringify(parsedSource.data)}" does not match the $type on reference {${refPath}}. Types "${parsedSource.data.$type}" and "${parsedRef.data.$type}" do not match.`,
    );
  }

  return true;
};
