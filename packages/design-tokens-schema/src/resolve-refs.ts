import dlv from 'dlv';
import * as z from 'zod';
import { TokenReferenceSchema } from './token-reference';
import { walkObject } from './walker';

const REF_REGEX = /^\{(.+)\}$/;

type ValueObject = { value?: unknown; [key: string]: unknown };

const isValueObject = (value: unknown): value is ValueObject => {
  return typeof value === 'object' && value !== null;
};

/**
 * @description Check if a value is a Token ref
 * @example
 * ```ts
 * extractRefPath('{ma.color.indigo.5}') // => 'ma.color.indigo.5'
 * extractRefPath('something-else') // => null
 * ```
 */
const extractRefPath = (value: string): string | null => {
  const match = REF_REGEX.exec(value);
  return match?.[1] ?? null;
};

const processRefs = (
  config: unknown,
  root: Record<string, unknown> | undefined,
  onRefFound: (config: ValueObject, key: string, resolvedRef: unknown, tokenType: unknown, refPath: string) => boolean,
): boolean => {
  // Handle arrays by processing each item
  if (Array.isArray(config)) {
    for (const item of config) {
      if (!processRefs(item, root, onRefFound)) {
        return false;
      }
    }
    return true;
  }

  if (!isValueObject(config)) {
    return true;
  }

  for (const key in config) {
    const value = config[key];
    if (key === '$value' && typeof value === 'string') {
      // extract `ma.color.indigo.5` from `{ma.color.indigo.5}` if possible
      const refPath = extractRefPath(value);
      if (refPath) {
        const tokenType = config['$type']; // 'color' | 'fontFamily' | etc.

        // does 'ma.color.indigo.5.$value' path exist in `root`?
        const resolvedRef = dlv(root, refPath);
        if (!onRefFound(config, key, resolvedRef, tokenType, refPath)) {
          return false;
        }
        // Process the new value after replacement
        if (!processRefs(config[key], root, onRefFound)) {
          return false;
        }
      }
    } else {
      if (!processRefs(value, root, onRefFound)) {
        return false;
      }
    }
  }

  return true;
};

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';

const TokenWithRefSchema = z.looseObject({
  $extensions: z.record(z.string(), z.unknown()).optional(),
  $type: z.string(),
  $value: TokenReferenceSchema,
});
type TokenWithRef = z.infer<typeof TokenWithRefSchema>;

const ReferencedTokenSchema = z.looseObject({
  $type: z.string(),
  $value: z.object(),
});

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root?: Record<string, unknown>): void => {
  walkObject<TokenWithRef>(
    config,
    (data): data is TokenWithRef => {
      // Chekc that we're dealing with a token-like object
      const parsedSource = TokenWithRefSchema.safeParse(data);
      if (parsedSource.success === false) return false;

      // Grab the `{path.to.ref} -> path.to.ref` and find it inside root
      const refPath = parsedSource.data.$value.slice(1, -1);
      const ref = dlv(root, refPath) || dlv(root, `brand.${refPath}`) || dlv(root, `common.${refPath}`);

      // Check that we're dealing with a token-like object
      const parsedRef = ReferencedTokenSchema.safeParse(ref);
      if (parsedRef.success === false) return false;

      // make sure the $type of the referenced token is the same
      if (parsedSource.data.$type !== parsedRef.data.$type) return false;

      return true;
    },
    (obj) => {
      // Look up path.to.ref in root
      const refPath = obj.$value.slice(1, -1);
      const ref = dlv(root, refPath) || dlv(root, `brand.${refPath}`) || dlv(root, `common.${refPath}`);

      // Replace the object's value with the ref's value
      obj['$value'] = ref.$value;
      // Add an extension to indicate that we changed `refPath` to an actual value
      obj['$extensions'] = {
        ...(obj.$extensions || Object.create(null)),
        [EXTENSION_RESOLVED_FROM]: refPath,
      };
    },
  );
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and check that they have actual values in `root` and that the $type overlaps
 */
export const validateRefs = (config: unknown, root?: Record<string, unknown>): boolean => {
  return processRefs(config, root, (_config, _key, resolvedRef, tokenType, refPath) => {
    if (!isValueObject(resolvedRef)) {
      return false;
    }

    if (!resolvedRef['$value']) {
      throw new Error(`Invalid token reference: expected "${refPath}" to have a "$value" property`);
    }

    if (tokenType !== resolvedRef['$type']) {
      throw new Error(
        `Invalid token reference: $type "${tokenType}" of "${JSON.stringify(_config)}" does not match the $type on reference {${refPath}} => ${JSON.stringify(resolvedRef)}`,
      );
    }
    return true;
  });
};
