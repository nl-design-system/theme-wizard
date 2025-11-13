import dlv from 'dlv';
import { type TokenWithRefLike, isTokenWithRef, isTokenWithRefLike, type RefLike } from './token-reference';
import { walkObject, walkTokensWithRef } from './walker';

// Extension that holds the actual design token value in case a token used a {ref.value} to antoher token
export const EXTENSION_RESOLVED_AS = 'nl.nldesignsystem.value-resolved-as';
// Extension that stores the {ref.name} to another token in case we replaced a token.$value
export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';

export const getRef = (refPath: RefLike, root: Record<string, unknown>): unknown => {
  // Remove the wrapping { and }
  const path = refPath.slice(1, -1);
  // Look up path.to.ref in root or in `brand` because NLDS tokens don't always include the `.brand` part
  const ref = dlv(root, path) || dlv(root, `brand.${path}`);
  if (!ref) {
    return null;
  }
  if (isTokenWithRefLike(ref)) {
    return getRef(ref.$value, root);
  }
  return ref;
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkTokensWithRef(config, root, (token) => {
    const ref = getRef(token.$value, root)!;
    // Add an extension to indicate that we changed `refPath` to an actual value
    token['$extensions'] = {
      ...(token['$extensions'] || Object.create(null)),
      [EXTENSION_RESOLVED_AS]: ref,
    };
  });
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and check that they have actual values in `root` and that the $type overlaps
 */
export const validateRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkObject<TokenWithRefLike>(config, (data, path) => isTokenWithRef(data, root, path));
};
