import { BaseDesignTokenProperties } from './base-token';
import { isTokenLike } from './token-reference';

const knownKeys = new Set<string>(BaseDesignTokenProperties);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Internal function that handles non-record inputs
 */
const processValue = (value: unknown): unknown => {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(processValue);
  }

  const cleaned: Record<string, unknown> = Object.create(null);

  for (const [key, val] of Object.entries(value)) {
    // For tokens, skip any non-standard keys (metadata)
    // For non-tokens, keep all keys but recursively strip their values
    if (isTokenLike(value) && !knownKeys.has(key)) {
      continue;
    }

    // Recursively strip metadata from nested objects
    cleaned[key] = processValue(val);
  }

  return cleaned;
};

/**
 * Recursively strips metadata properties from all objects that match the token shape.
 * Metadata is any property not in: $value, $type, $deprecated, $description, $extensions
 */
export const removeNonTokenProperties = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result = processValue(obj);
  if (isRecord(result)) {
    return result satisfies Record<string, unknown>;
  }
  // This should never be reached but here for type-safety.
  // There's an exlusion rule in vitest.config.ts because of this line
  return Object.create(null);
};
