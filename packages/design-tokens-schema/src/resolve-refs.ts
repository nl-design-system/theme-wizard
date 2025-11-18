import dlv from 'dlv';
import { BaseDesignToken, type BaseDesignTokenValue } from './base-token';
import { TokenReference, type TokenWithRefLike, isTokenWithRef } from './token-reference';
import { walkObject, walkTokensWithRef } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';
export const EXTENSION_RESOLVED_AS = 'nl.nldesignsystem.value-resolved-as';

export type ResolvedToken = BaseDesignTokenValue & {
  $value: TokenReference;
  $extensions: {
    [EXTENSION_RESOLVED_AS]: BaseDesignToken['$value'];
  };
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkTokensWithRef(config, root, (token) => {
    const refPath = token.$value.slice(1, -1);
    // Look up path.to.ref in root or in `brand` because NLDS tokens don't always include the `.brand` part
    const ref = dlv(root, refPath) || dlv(root, `brand.${refPath}`);

    // Add an extension with the resolved ref's value
    token.$extensions = {
      ...(token.$extensions || Object.create(null)),
      [EXTENSION_RESOLVED_AS]: structuredClone(ref.$value),
    } satisfies ResolvedToken['$extensions'];
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
