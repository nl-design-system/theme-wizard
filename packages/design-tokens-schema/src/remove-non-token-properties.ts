import { BASE_DESIGN_TOKEN_PROPERTIES } from './tokens/base-token';
import { isTokenLike, isValueObject } from './tokens/token-reference';

const knownKeys = new Set<string>(BASE_DESIGN_TOKEN_PROPERTIES);

// Tread carefully when encountering $value or $extensions which may/could contain any arbitrary content
const isOpaqueKey = (key: string): boolean => key === '$value' || key === '$extensions';

// Content of a $value/$extensions payload is opaque data, not tree structure: keep as-is.
const cleanValuePayload = (value: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = Object.create(null);
  for (const [key, val] of Object.entries(value)) {
    cleaned[key] = processValue(val, true);
  }
  return cleaned;
};

// A token is a leaf: every key, $-prefixed or not, must be in the known allowlist.
const cleanToken = (value: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = Object.create(null);
  for (const [key, val] of Object.entries(value)) {
    if (!knownKeys.has(key)) {
      continue;
    }
    cleaned[key] = processValue(val, isOpaqueKey(key));
  }
  return cleaned;
};

// A group: $-keys must be in the allowlist; non-$ keys are child identifiers,
// kept only when their value is itself a nested token or group.
const cleanGroup = (value: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = Object.create(null);
  for (const [key, val] of Object.entries(value)) {
    if (key.startsWith('$')) {
      if (knownKeys.has(key)) {
        cleaned[key] = processValue(val, key === '$extensions');
      }
      continue;
    }

    if (isValueObject(val) || Array.isArray(val)) {
      cleaned[key] = processValue(val, false);
    }
  }
  return cleaned;
};

// `insideValue` is true once inside a $value/$extensions payload, where content is opaque.
const processValue = (value: unknown, insideValue = false): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => processValue(entry, insideValue));
  }

  if (!isValueObject(value)) {
    return value;
  }

  if (insideValue) {
    return cleanValuePayload(value);
  }

  return isTokenLike(value) ? cleanToken(value) : cleanGroup(value);
};

/**
 * Recursively strips non-token properties from every token and group in the tree.
 * Metadata is any property not in: $value, $type, $deprecated, $description, $extensions.
 */
export const removeNonTokenProperties = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result = processValue(obj);
  if (isValueObject(result)) {
    return result satisfies Record<string, unknown>;
  }
  // Unreachable, but keeps this type-safe; excluded from coverage in vitest.config.ts
  return Object.create(null);
};
