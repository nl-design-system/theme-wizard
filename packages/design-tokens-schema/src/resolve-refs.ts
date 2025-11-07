import dlv from 'dlv';
import * as z from 'zod';
import { TokenReferenceSchema } from './token-reference';
import { walkObject } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';

const TokenWithRefSchema = z.looseObject({
  $extensions: z.record(z.string(), z.unknown()).optional(),
  $type: z.string(),
  $value: TokenReferenceSchema,
});
type TokenWithRef = z.infer<typeof TokenWithRefSchema>;

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
const isTokenWithRef = (data: unknown, root?: Record<string, unknown>): data is TokenWithRef => {
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

const walkTokensWithRef = (
  config: unknown,
  root: Record<string, unknown>,
  callback: (token: TokenWithRef) => void,
): void => {
  walkObject<TokenWithRef>(config, (data): data is TokenWithRef => isTokenWithRef(data, root), callback);
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkTokensWithRef(config, root, (token) => {
    // Look up path.to.ref in root
    const refPath = token.$value.slice(1, -1);
    const ref = dlv(root, refPath) || dlv(root, `brand.${refPath}`);
    // Replace the object's value with the ref's value
    token['$value'] = ref.$value;
    // Add an extension to indicate that we changed `refPath` to an actual value
    token['$extensions'] = {
      ...(token.$extensions || Object.create(null)),
      [EXTENSION_RESOLVED_FROM]: refPath,
    };
  });
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and check that they have actual values in `root` and that the $type overlaps
 */
export const validateRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkObject<TokenWithRef>(config, (data) => isTokenWithRef(data, root));
};
