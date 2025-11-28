import { BaseDesignTokenProperties } from './base-token';

const knownKeys = new Set<string>(BaseDesignTokenProperties);

/**
 * Recursively strips metadata properties from all objects that match the token shape.
 * Metadata is any property not in: $value, $type, $deprecated, $description, $extensions
 */
export const removeNonTokenProperties = (obj: unknown): Record<string, unknown> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeNonTokenProperties);
  }

  // Only process object-like values
  const objAsRecord = obj as Record<string, unknown>;

  // Check if this looks like a token (has $type and $value)
  const isToken = '$type' in objAsRecord && '$value' in objAsRecord;

  const cleaned: Record<string, unknown> = Object.create(null);

  for (const [key, value] of Object.entries(objAsRecord)) {
    // For tokens, skip any non-standard keys (metadata)
    // For non-tokens, keep all keys but recursively strip their values
    if (isToken && !knownKeys.has(key)) {
      continue;
    }

    // Recursively strip metadata from nested objects
    cleaned[key] = removeNonTokenProperties(value);
  }

  return cleaned;
};
