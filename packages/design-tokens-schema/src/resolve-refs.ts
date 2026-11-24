import dlv from 'dlv';
import type { BaseDesignToken } from './tokens/base-token';
import { setExtension } from './extensions';
import {
  TokenReference,
  type TokenRefError,
  type TokenWithRefLike,
  isTokenWithRef,
  isRef,
  isTokenLike,
  extractRef,
} from './tokens/token-reference';
import { walkObject, walkTokensWithRef } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';
export const EXTENSION_RESOLVED_AS = 'nl.nldesignsystem.value-resolved-as';

declare module './extensions' {
  interface ExtensionTypeMap {
    [EXTENSION_RESOLVED_FROM]: TokenReference;
    [EXTENSION_RESOLVED_AS]: BaseDesignToken['$value'];
  }
}

export type ResolvedToken = BaseDesignToken & {
  $value: TokenReference;
  $extensions: {
    [EXTENSION_RESOLVED_AS]: BaseDesignToken['$value'];
  };
};

// Look up path.to.ref in root or in `brand` because NL Design System tokens don't always include the `.brand` part
const findReferencedToken = (root: object, ref: TokenReference): BaseDesignToken | undefined => {
  const refPath = extractRef(ref);
  const resolved = dlv(root, refPath) || dlv(root, `brand.${refPath}`);
  return isTokenLike(resolved) ? resolved : undefined;
};

/** Every reference followed from `value` until a non-ref value, a missing token or a cycle */
export const getRefChain = (root: object, value: unknown): TokenReference[] => {
  const chain: TokenReference[] = [];
  let current = value;

  while (isRef(current) && !chain.includes(current)) {
    chain.push(current);
    current = findReferencedToken(root, current)?.$value;
  }

  return chain;
};

/** The token at the end of the ref chain, or `undefined` for a missing token or a cycle */
export const resolveRef = (root: object, path: TokenReference): BaseDesignToken | undefined => {
  const lastRef = getRefChain(root, path).at(-1);
  const resolved = lastRef ? findReferencedToken(root, lastRef) : undefined;

  // A ref value on the last token means the chain stopped at a cycle
  return resolved && !isRef(resolved.$value) ? resolved : undefined;
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

    // Clear any previously resolved value before setting to avoid array concatenation
    // when resolveRefs is called multiple times on the same token object.
    delete token.$extensions?.[EXTENSION_RESOLVED_AS];

    // Add an extension with the resolved ref's value
    setExtension(token, EXTENSION_RESOLVED_AS, structuredClone(ref.$value));
  });
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and check that they have actual values in `root` and that the $type overlaps
 */
export const validateRefs = (
  config: unknown,
  root: Record<string, unknown>,
  onError: (error: TokenRefError) => void = () => {},
): void => {
  walkObject<TokenWithRefLike>(config, (data, path) => isTokenWithRef(data, root, path, onError));
};
