import dlv from 'dlv';
import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema, TokenPath, type BaseDesignToken } from './base-token';

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

// Not inferring the type from the zod schema because that would be a plain string
export type TokenReference = `{${string}}`;

export const createReference = (path: TokenPath): TokenReference => {
  return `{${path.join('.')}}`;
};

export const isValueObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === 'object';
};

export const isTokenLike = (obj: unknown): obj is BaseDesignToken => {
  if (!isValueObject(obj)) return false;
  // Must have a `$type: string`
  if (!Object.hasOwn(obj, '$type') || typeof obj['$type'] !== 'string') return false;
  // Must have a `$value`
  return Object.hasOwn(obj, '$value');
};

export const isTokenGroup = (obj: unknown): obj is Record<string, BaseDesignToken> => {
  if (!isValueObject(obj)) return false;
  if (Object.hasOwn(obj, '$value')) return false;
  if (Object.hasOwn(obj, '$type') && typeof obj['$type'] !== 'string') return false;
  if (Object.hasOwn(obj, '$extensions') && !isValueObject(obj['$extensions'])) return false;
  return Object.entries(obj)
    .filter(([key]) => !key.startsWith('$'))
    .every(([, token]) => isTokenLike(token));
};

/** @deprecated use `BaseDesignToken` instead */
export type TokenLike = {
  $type: string;
  $value: unknown;
};

export type TokenWithRefLike = BaseDesignToken & {
  $value: `{${string}}`;
};

export const isRef = (value: unknown): value is TokenReference => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

export const extractRef = (ref: TokenReference): string => ref.slice(1, -1);

const isTokenWithRefLike = (obj: unknown): obj is TokenWithRefLike => {
  if (!isTokenLike(obj)) return false;
  return isRef(obj['$value']);
};

export type TokenRefError = {
  code: 'ref_not_found' | 'ref_not_a_token' | 'ref_type_mismatch';
  path: string[];
  referencedPath: string;
  referencedToken: unknown;
  message: string;
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
  onError: (error: TokenRefError) => void,
): token is TokenWithRefLike => {
  // Check that we're dealing with a token-like object with a ref in the $value
  if (!isTokenWithRefLike(token)) return false;

  // Grab the `{path.to.ref} -> path.to.ref` and find it inside root
  const referencedPath = extractRef(token.$value);
  const referencedToken = dlv(root, referencedPath) || dlv(root, `brand.${referencedPath}`);

  if (!referencedToken) {
    onError({
      code: 'ref_not_found',
      message: `Invalid token reference: can not find "${referencedPath}"`,
      path,
      referencedPath,
      referencedToken,
    });
    return false;
  }

  if (!isTokenLike(referencedToken)) {
    onError({
      code: 'ref_not_a_token',
      message: `Invalid token reference: expected "{${referencedPath}}" to have a "$value" and "$type" property (referenced from "${path.join('.')}")`,
      path,
      referencedPath,
      referencedToken,
    });
    return false;
  }

  // make sure the $type of the referenced token is the same type
  if (token.$type !== referencedToken.$type) {
    onError({
      code: 'ref_type_mismatch',
      message: `Invalid token reference: $type "${token['$type']}" of "${JSON.stringify(token)}" at "${path.join('.')}" does not match the $type on reference {${referencedPath}}. Types "${token.$type}" and "${referencedToken.$type}" do not match.`,
      path,
      referencedPath,
      referencedToken,
    });
    return false;
  }

  return true;
};
