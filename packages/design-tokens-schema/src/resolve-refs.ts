import dlv from 'dlv';

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
  const match = REF_REGEX.exec(value)!;
  return match[1];
};

const processRefs = (
  config: unknown,
  root: Record<string, unknown> | undefined,
  onRefFound: (config: ValueObject, key: string, resolvedRef: unknown) => boolean,
): boolean => {
  if (!isValueObject(config)) return true;

  for (const key in config) {
    const value = config[key];
    if (key === '$value' && typeof value === 'string') {
      // extract `ma.color.indigo.5` from `{ma.color.indigo.5}` if possible
      const refPath = extractRefPath(value);
      if (refPath) {
        // does 'ma.color.indigo.5.$value' path exist in `root`?
        // Note that we add `$value` because we replace one $value with another
        const resolvedRef = dlv(root, `${refPath}.$value`);
        if (!onRefFound(config, key, resolvedRef)) {
          return false;
        }
      }
    } else if (!processRefs(value, root, onRefFound)) {
      return false;
    }
  }

  return true;
};

/**
 * @description
 * Recursively loop over `config` to look for {ma.color.indigo.5} -like token refs
 * and replace them with the actual values from `root`
 */
export const resolveRefs = (config: unknown, root?: Record<string, unknown>): void => {
  processRefs(config, root, (config, key, resolvedRef) => {
    if (resolvedRef !== undefined) {
      config[key] = resolvedRef;
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
  return processRefs(config, root, (_config, _key, resolvedRef) => {
    return resolvedRef !== undefined;
  });
};
