import dlv from 'dlv';
import type { BaseDesignTokenValue } from './base-token';

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
  if (!isValueObject(config)) return true;

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
      }
    } else if (!processRefs(value, root, onRefFound)) {
      return false;
    }
  }

  return true;
};

export const EXTENSION_RESOLVED_FROM = 'nl.nldesignsystem.value-resolved-from';

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root?: Record<string, unknown>): void => {
  processRefs(config, root, (config, key, resolvedRef, _tokenType, refPath) => {
    if (isValueObject(resolvedRef) && resolvedRef['$value']) {
      config[key] = resolvedRef['$value'];
      config['$extensions'] ??= {} as BaseDesignTokenValue['$extensions'];
      config['$extensions'][EXTENSION_RESOLVED_FROM] = refPath;
    }
    return true;
  });
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
