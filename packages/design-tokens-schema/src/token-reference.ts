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

export const isValueObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === 'object';
};

type TokenLike = {
  $type: string;
  $value: unknown;
};

const isTokenLike = (obj: unknown): obj is TokenLike => {
  if (!isValueObject(obj)) return false;
  // Must have a `$type: string`
  if (!('$type' in obj) || typeof obj['$type'] !== 'string') return false;
  // Must have a `$value`
  return '$value' in obj;
};

export type TokenWithRefLike = {
  $type: string;
  $value: `{${string}}`;
  $extensions?: Record<string, unknown>;
};

export const isRef = (value: unknown): boolean => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

const isTokenWithRefLike = (obj: unknown): obj is TokenWithRefLike => {
  if (!isTokenLike(obj)) return false;
  return isRef(obj['$value']);
};

/**
 * A predicate function that checks if a given ref in our schema is valid.
 * Note that it either throws an error or returns a boolean:
 * This is because it's used both as a Zod validation as well as a regular predicate.
 *
 * @param token A part of the root config in which refs may be present
 * @param root The root of the config in which tokens are searched
 */
export const isTokenWithRef = (
  token: unknown,
  root: Record<string, unknown>,
  path: string[],
): token is TokenWithRefLike => {
  // Check that we're dealing with a token-like object with a ref in the $value
  if (!isTokenWithRefLike(token)) return false;

  // Grab the `{path.to.ref} -> path.to.ref` and find it inside root
  const refPath = token.$value.slice(1, -1);
  const referencedToken = dlv(root, refPath) || dlv(root, `brand.${refPath}`);

  if (!referencedToken) {
    throw new Error(`Invalid token reference: can not find "${refPath}"`);
  }

  if (!isTokenLike(referencedToken)) {
    throw new Error(
      `Invalid token reference: expected "{${refPath}}" to have a "$value" and "$type" property (referenced from "${path.join('.')}")`,
    );
  }

  // make sure the $type of the referenced token is the same type
  if (token.$type !== referencedToken.$type) {
    throw new Error(
      `Invalid token reference: $type "${token['$type']}" of "${JSON.stringify(token)}" does not match the $type on reference {${refPath}}. Types "${token.$type}" and "${referencedToken.$type}" do not match.`,
    );
  }

  return true;
};
