// Metadata keys to strip from tokens
const TOKEN_METADATA_KEYS = new Set([
  'filePath',
  'isSource',
  'original',
  'name',
  'attributes',
  'path',
]);

/**
 * Recursively strips metadata properties from all objects that match the token shape.
 * Metadata is any property not in: $value, $type, $deprecated, $description, $extensions
 */
export const stripMetadata = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(stripMetadata);
  }

  // Only process object-like values
  const objAsRecord = obj as Record<string, unknown>;

  // Check if this looks like a token (has $type and $value)
  const isToken = '$type' in objAsRecord && '$value' in objAsRecord;

  // Standard token property names
  const STANDARD_KEYS = new Set(['$type', '$value', '$deprecated', '$description', '$extensions']);

  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(objAsRecord)) {
    // Skip metadata keys
    if (TOKEN_METADATA_KEYS.has(key)) {
      continue;
    }

    // For tokens, skip any non-standard keys (metadata)
    // For non-tokens, keep all keys but recursively strip their values
    if (isToken && !STANDARD_KEYS.has(key)) {
      continue;
    }

    // Recursively strip metadata from nested objects
    cleaned[key] = stripMetadata(value);
  }

  return cleaned;
};
