import { BaseDesignToken } from './tokens/base-token';
import { stringifyColor } from './tokens/color-token';
import { ModernDimensionValueSchema, stringifyDimension } from './tokens/dimension-token';
import { ModernDurationValueSchema, stringifyDuration } from './tokens/duration-token';
import { ModernFontFamilyValueSchema, stringifyFontFamily } from './tokens/fontfamily-token';
import { stringifyNumber } from './tokens/number-token';
import { ResolvedShadowValueSchema, stringifyBoxShadow } from './tokens/shadow-token';
import { isColorToken } from './walker';

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
    const parsed = ModernFontFamilyValueSchema.safeParse(token.$value);
    if (parsed.success) {
      return stringifyFontFamily(parsed.data);
    }
  }

  if (token.$type === 'duration') {
    const parsed = ModernDurationValueSchema.safeParse(token.$value);
    if (parsed.success) {
      return stringifyDuration(parsed.data);
    }
  }

  if (token.$type === 'shadow') {
    const parsed = ResolvedShadowValueSchema.safeParse(token.$value);
    if (parsed.success) {
      return stringifyBoxShadow(parsed.data);
    }
  }

  if (token.$type === 'number' && Number.isFinite(token.$value)) {
    return stringifyNumber(Number(token.$value));
  }

  return JSON.stringify(token.$value);
};
