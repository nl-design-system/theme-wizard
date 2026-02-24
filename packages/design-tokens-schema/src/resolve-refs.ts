import dlv from 'dlv';
import type { BaseDesignToken, BaseDesignToken } from './tokens/base-token';
import { setExtension } from './extensions';
import { legacyToModernColor } from './tokens/color-token';
import { TokenReference, type TokenWithRefLike, isTokenWithRef, isRef, isTokenLike } from './tokens/token-reference';
import { walkObject, walkTokensWithRef } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';
export const EXTENSION_RESOLVED_AS = 'nl.nldesignsystem.value-resolved-as';

export type ResolvedToken = BaseDesignToken & {
  $value: TokenReference;
  $extensions: {
    [EXTENSION_RESOLVED_AS]: BaseDesignToken['$value'];
  };
};

export const resolveRef = (root: object, path: string): unknown => {
  const refPath = path.slice(1, -1);
  // Look up path.to.ref in root or in `brand` because NL Design System tokens don't always include the `.brand` part
  const resolved = dlv(root, refPath) || dlv(root, `brand.${refPath}`);

  if (isTokenLike(resolved)) {
    const tokenValue = resolved.$value;
    // If the resolved value is a token object with a $value that is itself a reference, recursively resolve it
    if (typeof tokenValue === 'string' && isRef(tokenValue)) {
      return resolveRef(root, tokenValue);
    }
  }

  return resolved;
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root: Record<string, unknown>): void => {
  walkTokensWithRef(config, root, (token) => {
    const ref = resolveRef(root, token.$value);

    // Ensure ref is a token object with $value and $type
    if (!isTokenLike(ref)) return;

    // Add an extension with the resolved ref's value
    setExtension(token, EXTENSION_RESOLVED_AS, structuredClone(ref.$value));
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
