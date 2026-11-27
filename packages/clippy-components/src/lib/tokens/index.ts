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
  isTokenLike,
  stringifyToken,
  type TokenPath,
} from '@nl-design-system-community/design-tokens-schema';
import Color, { type ColorTypes } from 'colorjs.io';

/** Converts a token path (e.g. `['nl', 'color', 'red']`) into a CSS custom property name (`--nl-color-red`). */
export const tokenPathToCSSCustomProperty = (tokenPath: TokenPath): string => '--' + tokenPath.join('-');

/** Stringify a token value, using the resolved_as value, if available */
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

// Token order: https://github.com/nl-design-system/documentatie/blob/main/docs/handboek/huisstijl-vastleggen/_design-tokens-volgorde.md
const KNOWN_ELEMENTS = new Set([
  'description',
  'header',
  'footer',
  'heading',
  'icon',
  'lead',
  'indicator',
  'label',
  'marker',
]);
const USER_ACTION_STATES = new Set(['active', 'focus', 'focus-visible', 'hover']);
// https://nldesignsystem.nl/handboek/developer/state-conventie/
const COMPONENT_STATES = new Set([
  'checked',
  'current',
  'disabled',
  'expanded',
  'indeterminate',
  'invalid',
  'pressed',
  'read-only',
  'readonly',
  'required',
  'selected',
  'valid',
  'visited',
]);

// States and elements are always English
// Create a collator only once instead of creating a new one on every `String.localeCompare()`
const collator = new Intl.Collator('en');

// Tokens, elements, user action states, component states, then appearances
const getSortTier = (name: string, item: unknown): number => {
  if (isTokenLike(item)) {
    return 0;
  }
  if (KNOWN_ELEMENTS.has(name)) {
    return 1;
  }
  if (USER_ACTION_STATES.has(name)) {
    return 2;
  }
  if (COMPONENT_STATES.has(name)) {
    return 3;
  }
  return 4;
};

export const compareTokenEntries = ([nameA, itemA]: [string, unknown], [nameB, itemB]: [string, unknown]): number =>
  getSortTier(nameA, itemA) - getSortTier(nameB, itemB) || collator.compare(nameA, nameB);
