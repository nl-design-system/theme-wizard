import {
  type BaseDesignToken,
  type ModernDimensionValue,
  ModernDimensionValueSchema,
  ModernFontFamilyNameSchema,
  isColorToken,
  stringifyColor,
  stringifyDimension,
  stringifyFontFamily,
  stringifyNumber,
} from '@nl-design-system-community/design-tokens-schema';

export const PX_PER_REM = 16;

export const dimensionToPx = (value: ModernDimensionValue) => {
  const normalized = { ...value };
  if (normalized.unit === 'rem') {
    normalized.unit = 'px';
    normalized.value = normalized.value * PX_PER_REM;
  }
  return normalized;
};

export const stringifyToken = (token: BaseDesignToken): string => {
  if (isColorToken(token)) {
    return stringifyColor(token.$value);
  }

  if (token.$type === 'dimension') {
    const parsed = ModernDimensionValueSchema.safeParse(token.$value);
    if (parsed.success) {
      return stringifyDimension(parsed.data);
    }
  }

  if (token.$type === 'fontFamily') {
    const parsed = ModernFontFamilyNameSchema.safeParse(token.$value);
    if (parsed.success) {
      return stringifyFontFamily(parsed.data);
    }
  }

  if (token.$type === 'number' && Number.isFinite(token.$value)) {
    return stringifyNumber(Number(token.$value));
  }

  return JSON.stringify(token.$value);
};
