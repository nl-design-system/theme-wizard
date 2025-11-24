const pick = (obj: Record<string, unknown>, keys: string[]): Record<string, unknown> => {
  const copy = Object.create(null);
  for (const key of keys) {
    if (key in obj) {
      copy[key] = obj[key];
    }
  }
  return copy;
};

const TOKEN_KEYS = ['$type', '$value', '$deprecated', '$description', '$extensions'];

export const stripUnknown = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj;
  }

  // Check if this is a leaf node
  if (isToken(obj)) {
    // Return only $type and $value, removing any other properties
    const record = obj as Record<string, unknown>;
    return pick(record, TOKEN_KEYS);
  }

  // It's a plain object/record - filter recursively
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isToken(value)) {
      filtered[key] = value;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively filter nested objects
      const filtered_value = stripUnknown(value);
      if (Object.keys(filtered_value as Record<string, unknown>).length > 0) {
        filtered[key] = filtered_value;
      }
    }
  }
  return filtered;
};

// Helper to check if a value is a leaf node
const isToken = (val: unknown): boolean => {
  return typeof val === 'object' && val !== null && '$type' in val && '$value' in val;
};
