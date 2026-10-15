import { parse_dimension, parse_dimension as parse_duration } from '@projectwallace/css-parser';
import type { BaseDesignToken } from './tokens/base-token';
import { resolveRef } from './resolve-refs';
import { parseColor } from './tokens/color-token';
import { splitFontFamily } from './tokens/fontfamily-token';
import { isRef, isTokenLike, isValueObject } from './tokens/token-reference';
import { SKIP, walkObject, walkTokens } from './walker';

/**
 * @description Process a lineHeight value and return its target type and transformed value
 */
const processLineHeightValue = (
  lineHeight: unknown,
): { value?: unknown; type: 'number' | 'dimension' | 'lineHeight' } => {
  if (typeof lineHeight === 'number') {
    return { type: 'number' };
  }

  if (typeof lineHeight === 'string') {
    if (lineHeight.endsWith('%')) {
      const percentage = Number.parseFloat(lineHeight.slice(0, -1));
      return { type: 'number', value: percentage / 100 };
    }

    const parsedAsNumber = Number.parseFloat(lineHeight);
    if (parsedAsNumber.toString() === lineHeight) {
      return { type: 'number', value: parsedAsNumber };
    }

    const { unit, value: parsedValue } = parse_dimension(lineHeight);
    if (Number.isFinite(parsedValue)) {
      if (unit) {
        return { type: 'dimension', value: { unit, value: parsedValue } };
      }
      return { type: 'number', value: parsedValue };
    }
  }

  // The next line is type-safe, but because of that we don't cover all branches
  return { type: 'lineHeight' };
};

/**
 * @description Parse a dimension string value (e.g., "16px", "1rem") to dimension object
 */
const parseDimensionValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const parsed = parse_dimension(value);
    if ((parsed.unit === 'px' || parsed.unit === 'rem') && Number.isFinite(parsed.value)) {
      return parsed;
    }
  }
  return value;
};

/**
 * @description Upgrade a dimension token
 */
const upgradeDimensionToken = (token: BaseDesignToken): void => {
  token.$value = parseDimensionValue(token.$value);
};

/**
 * @description Parse a duration string value (e.g., "200ms", "1s") to a duration object,
 * reusing whichever unit (s or ms) the legacy value was expressed in
 */
const parseDurationValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    const parsed = parse_duration(value);
    if ((parsed.unit === 's' || parsed.unit === 'ms') && Number.isFinite(parsed.value)) {
      return parsed;
    }
  }
  return value;
};

/**
 * @description Upgrade a duration token
 */
const upgradeDurationToken = (token: BaseDesignToken): void => {
  token.$value = parseDurationValue(token.$value);
};

/**
 * @description Upgrade a fontSize token (convert to dimension type, parse value, set subtype)
 */
const upgradeFontSizeToken = (token: BaseDesignToken): void => {
  token.$type = 'dimension';
  token.$value = parseDimensionValue(token.$value);
};

/**
 * @description Upgrade a lineHeight token (determine type, parse value if needed)
 */
const upgradeLineHeightToken = (token: BaseDesignToken, rootConfig: Record<string, unknown>): void => {
  // If it's already a number, convert the type only
  if (typeof token.$value === 'number') {
    token.$type = 'number';
    return;
  }

  // If it's a reference, determine the type from the referenced token
  if (isRef(token.$value)) {
    const refToken = resolveRef(rootConfig, token.$value);
    if (isTokenLike(refToken)) {
      const { type } = processLineHeightValue(refToken.$value);
      token.$type = type;
    }
    return;
  }

  // If it's a string, process and convert the type
  if (typeof token.$value === 'string') {
    const { type, value } = processLineHeightValue(token.$value);
    token.$type = type;
    if (value !== undefined) {
      token.$value = value;
    }
  }
};

/**
 * @description Parse a legacy color string to the modern color format. Refs and unparsable values are left as-is.
 */
const parseColorValue = (value: unknown): unknown => {
  if (typeof value === 'string' && !isRef(value)) {
    try {
      return parseColor(value);
    } catch {
      // If parsing fails, leave the value as is - schema validation will catch it
    }
  }
  return value;
};

/**
 * @description Upgrade a color token (parse legacy color strings to modern format)
 */
const upgradeColorToken = (token: BaseDesignToken): void => {
  token.$value = parseColorValue(token.$value);
};

/**
 * @description Parse a stringified number to an actual number. Refs are left as-is.
 */
const parseNumberValue = (value: unknown): unknown => {
  if (typeof value === 'string' && !isRef(value)) {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};

/**
 * @description Upgrade a number token (parse a stringified value to an actual number)
 */
const upgradeNumberToken = (token: BaseDesignToken): void => {
  token.$value = parseNumberValue(token.$value);
};

/**
 * @description Upgrade a legacy fontFamilies token (convert to fontFamily type and parse value)
 */
const upgradeLegacyFontFamiliesToken = (token: BaseDesignToken): void => {
  token.$type = 'fontFamily';
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    token.$value = splitFontFamily(token.$value);
  }
};

/**
 * @description Upgrade a fontFamily token with legacy string value (parse to array/string)
 */
const upgradeFontFamilyTokenWithLegacyValue = (token: BaseDesignToken): void => {
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    token.$value = splitFontFamily(token.$value);
  }
};

const fontWeightMap: Record<string, number> = {
  /* eslint-disable perfectionist/sort-objects */
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

/**
 * @description Convert `'700'` to `700`, or `normal` to `400`, etc.
 */
export const parseFontWeight = (input: string): number | null => {
  const normalized = input.toLowerCase();
  if (Object.hasOwn(fontWeightMap, normalized)) {
    return fontWeightMap[normalized];
  }
  const asNumber = Number(normalized);
  if (Number.isFinite(asNumber)) {
    return asNumber;
  }
  return null;
};

/**
 * @description set the correct $type and $value on a font-weight token
 */
const upgradeFontWeightToken = (token: BaseDesignToken): void => {
  token.$type = 'number';

  // Token Studio stores named font-weights, so we need to map them to numbers
  const value = token.$value;
  if (typeof value === 'string') {
    const parsed = parseFontWeight(value);
    if (parsed !== null) {
      token.$value = parsed;
    }
  }
};

/**
 * @description Parse a legacy shadow dimension (x/y/blur/spread). Unlike dimension tokens, Token
 * Studio stores these as unitless numbers (meaning px), so that's tried as a fallback.
 */
const parseShadowDimensionValue = (value: unknown): unknown => {
  if (isRef(value)) {
    return value;
  }
  const stringValue = typeof value === 'number' ? String(value) : value;
  const parsedDimension = parseDimensionValue(stringValue);
  if (parsedDimension !== stringValue) {
    return parsedDimension;
  }
  const parsedNumber = parseNumberValue(stringValue);
  return typeof parsedNumber === 'number' ? { unit: 'px', value: parsedNumber } : value;
};

/**
 * @description Upgrade a single legacy shadow object (`{ x, y, blur, spread, color, type }`)
 */
const upgradeLegacyShadowValue = (value: unknown): unknown => {
  if (isRef(value) || !isValueObject(value) || !('x' in value)) {
    return value;
  }

  const upgraded: Record<string, unknown> = {
    blur: parseShadowDimensionValue(value['blur']),
    color: parseColorValue(value['color']),
    offsetX: parseShadowDimensionValue(value['x']),
    offsetY: parseShadowDimensionValue(value['y']),
    spread: parseShadowDimensionValue(value['spread']),
  };
  if (value['type'] === 'innerShadow') {
    upgraded['inset'] = true;
  }
  return upgraded;
};

/**
 * @description Upgrade a boxShadow token (convert to shadow type, map Token Studio shape to DTCG)
 */
const upgradeBoxShadowToken = (token: BaseDesignToken): void => {
  token.$type = 'shadow';
  token.$value = Array.isArray(token.$value)
    ? token.$value.map(upgradeLegacyShadowValue)
    : upgradeLegacyShadowValue(token.$value);
};

const LEGACY_SHADOW_GROUP_KEYS = ['x', 'y', 'blur', 'spread', 'color'] as const;

/**
 * @description Some legacy themes model a shadow as a group of sibling `x`/`y`/`blur`/`spread`/`color` tokens
 */
const isLegacyShadowGroup = (data: unknown): data is Record<string, BaseDesignToken> => {
  if (!isValueObject(data) || isTokenLike(data)) {
    return false;
  }
  return LEGACY_SHADOW_GROUP_KEYS.every((key) => isTokenLike(data[key]));
};

/**
 * @description Upgrade a legacy shadow group (sibling `x`/`y`/`blur`/`spread`/`color` tokens)
 */
const upgradeLegacyShadowGroup = (group: Record<string, BaseDesignToken>): void => {
  const value = {
    blur: parseShadowDimensionValue(group['blur'].$value),
    color: parseColorValue(group['color'].$value),
    offsetX: parseShadowDimensionValue(group['x'].$value),
    offsetY: parseShadowDimensionValue(group['y'].$value),
    spread: parseShadowDimensionValue(group['spread'].$value),
  };

  for (const key of LEGACY_SHADOW_GROUP_KEYS) {
    delete group[key];
  }

  Object.assign(group, { $type: 'shadow', $value: value });
};

/**
 * @description NLDS themes use $type: fontSize, fontSizes and lineHeight instead of number/dimension,
 * so a quick round of preprocessing helps to get them in order.
 */
export const upgradeLegacyTokens = (rootConfig: Record<string, unknown>): Record<string, unknown> => {
  // Cannot use walkTokens to detect legacy shadows groups, because a group is NOT a token.
  walkObject(rootConfig, isLegacyShadowGroup, (group) => {
    upgradeLegacyShadowGroup(group);
    return SKIP;
  });

  walkTokens(rootConfig, (token) => {
    switch (token.$type) {
      case 'dimension':
        upgradeDimensionToken(token);
        break;
      case 'duration':
        upgradeDurationToken(token);
        break;
      case 'fontSize':
      case 'fontSizes':
        upgradeFontSizeToken(token);
        break;
      case 'lineHeight':
      case 'lineHeights':
        upgradeLineHeightToken(token, rootConfig);
        break;
      case 'color':
        upgradeColorToken(token);
        break;
      case 'number':
        upgradeNumberToken(token);
        break;
      case 'fontFamilies':
        upgradeLegacyFontFamiliesToken(token);
        break;
      case 'fontFamily':
        upgradeFontFamilyTokenWithLegacyValue(token);
        break;
      case 'fontWeight':
      case 'fontWeights':
        upgradeFontWeightToken(token);
        break;
      case 'boxShadow':
        upgradeBoxShadowToken(token);
        break;
    }
  });
  return rootConfig;
};
