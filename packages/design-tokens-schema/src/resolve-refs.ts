import dlv from 'dlv';
import { type TokenWithRef, isTokenWithRef } from './token-reference';
import { walkObject, walkTokensWithRef } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';

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
      [EXTENSION_RESOLVED_FROM]: `{${refPath}}`,
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
