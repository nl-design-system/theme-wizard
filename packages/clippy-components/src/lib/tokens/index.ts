import {
  type BaseDesignToken,
  colorTokenValueToColorJS,
  ColorValue,
  EXTENSION_REFERENCE_COUNT,
  EXTENSION_REFERENCED_AT,
  EXTENSION_RESOLVED_AS,
  EXTENSION_TOKEN_PATH,
  getExtension,
  getTokenSubtype,
  isRef,
  stringifyToken,
} from '@nl-design-system-community/design-tokens-schema';
import Color, { type ColorTypes } from 'colorjs.io';

export const stringifyTokenValue = (token: BaseDesignToken): string => {
  const resolvedAs = getExtension(token, EXTENSION_RESOLVED_AS);
  return stringifyToken(isRef(token.$value) && resolvedAs ? { $type: token.$type, $value: resolvedAs } : token);
};

export const stringifyReferenceValue = (token: BaseDesignToken): string => {
  return isRef(token.$value) ? token.$value.replace(/[{}]/g, '') : '';
};

export const getTokenPath = (token: BaseDesignToken): string => {
  return getExtension(token, EXTENSION_TOKEN_PATH) || '';
};

export const getTokenColor = (token: BaseDesignToken): Color | undefined => {
  if (token.$type !== 'color') return undefined;
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    return new Color(token.$value as ColorTypes);
  }
  const resolvedAs = getExtension(token, EXTENSION_RESOLVED_AS);
  if (isRef(token.$value) && resolvedAs) {
    return colorTokenValueToColorJS(resolvedAs as ColorValue);
  }
  return colorTokenValueToColorJS(token.$value as ColorValue);
};

export const getTokenReferencedAt = (token: BaseDesignToken): string[] => {
  return getExtension(token, EXTENSION_REFERENCED_AT) || [];
};

export const getTokenReferenceCount = (token: BaseDesignToken): number => {
  return getExtension(token, EXTENSION_REFERENCE_COUNT) || 0;
};

export const getTokenDimensionSpaceConcept = (token: BaseDesignToken): string => {
  const subType = getTokenSubtype(token);
  return subType?.startsWith('space-') ? subType.split('-')[1] : '';
};
