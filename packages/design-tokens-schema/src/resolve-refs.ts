import dlv from 'dlv';
import { BaseDesignToken, type BaseDesignTokenValue } from './tokens/base-token';
import { legacyToModernColor } from './tokens/color-token';
import { TokenReference, type TokenWithRefLike, isTokenWithRef, isRef } from './tokens/token-reference';
import { walkObject, walkTokensWithRef } from './walker';

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';
export const EXTENSION_RESOLVED_AS = 'nl.nldesignsystem.value-resolved-as';

export type ResolvedToken = BaseDesignTokenValue & {
  $value: TokenReference;
  $extensions: {
    [EXTENSION_RESOLVED_AS]: BaseDesignToken['$value'];
  };
};

export const resolveRef = (root: object, path: string): unknown => {
  const refPath = path.slice(1, -1);
  // Look up path.to.ref in root or in `brand` because NLDS tokens don't always include the `.brand` part
  const resolved = dlv(root, refPath) || dlv(root, `brand.${refPath}`);

  // If the resolved value is a token object with a $value that is itself a reference, recursively resolve it
  if (resolved && typeof resolved === 'object' && '$value' in resolved) {
    const tokenValue = (resolved as { $value: unknown }).$value;
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
    if (!ref || typeof ref !== 'object' || !('$value' in ref)) {
      return;
    }

    // Capture the resolved value, transforming legacy colors to modern format if needed
    let resolvedValue = (ref as { $value: unknown; $type?: string }).$value;
    const refType = (ref as { $value: unknown; $type?: string }).$type;
    if (refType === 'color' && typeof resolvedValue === 'string' && !isRef(resolvedValue)) {
      resolvedValue = legacyToModernColor.decode(resolvedValue);
    }

    // Add an extension with the resolved ref's value
    token.$extensions = {
      ...(token.$extensions || Object.create(null)),
      [EXTENSION_RESOLVED_AS]: structuredClone(resolvedValue),
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
