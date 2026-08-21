import {
  type BaseDesignToken,
  colorTokenValueToColorJS,
  ColorValue,
  EXTENSION_REFERENCE_COUNT,
  EXTENSION_REFERENCED_AT,
  EXTENSION_TOKEN_PATH,
  getTokenSubtype,
  isRef,
} from '@nl-design-system-community/design-tokens-schema';
import Color, { type ColorTypes } from 'colorjs.io';

export const getTokenPath = (token: BaseDesignToken): string => {
  return (token.$extensions?.[EXTENSION_TOKEN_PATH] as string) || '';
};

export const getTokenColor = (token: BaseDesignToken): Color | undefined => {
  if (token.$type !== 'color') return undefined;
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    return new Color(token.$value as ColorTypes);
  }
  return colorTokenValueToColorJS(token.$value as ColorValue);
};

export const getTokenReferencedAt = (token: BaseDesignToken): string[] => {
  return (token.$extensions?.[EXTENSION_REFERENCED_AT] as string[]) || [];
};

export const getTokenReferenceCount = (token: BaseDesignToken): number => {
  return (token.$extensions?.[EXTENSION_REFERENCE_COUNT] as number) || 0;
};

export const getTokenDimensionSpaceConcept = (token: BaseDesignToken): string => {
  const subType = getTokenSubtype(token);
  return subType?.startsWith('space-') ? subType.split('-')[1] : '';
};
