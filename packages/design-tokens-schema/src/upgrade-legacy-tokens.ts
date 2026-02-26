import { parse_dimension } from '@projectwallace/css-parser';
import type { BaseDesignToken } from './tokens/base-token';
import { setExtension } from './extensions';
import { resolveRef } from './resolve-refs';
import { parseColor } from './tokens/color-token';
import { legacyToModernFontFamily } from './tokens/fontfamily-token';
import { isRef, isTokenLike } from './tokens/token-reference';
import { walkTokens } from './walker';

export const EXTENSION_TOKEN_SUBTYPE = 'nl.nldesignsystem.token-subtype';

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
    if (unit && Number.isFinite(parsedValue)) {
      return { type: 'dimension', value: { unit, value: parsedValue } };
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
 * @description Upgrade a dimension token (parse string values, set subtype extension)
 */
const upgradeDimensionToken = (token: BaseDesignToken, path: string[]): void => {
  token.$value = parseDimensionValue(token.$value);

  if (path.includes('font-size')) {
    setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'font-size');
  } else if (path.includes('line-height')) {
    setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'line-height');
  }
};

/**
 * @description Upgrade a fontSize token (convert to dimension type, parse value, set subtype)
 */
const upgradeFontSizeToken = (token: BaseDesignToken): void => {
  token.$type = 'dimension';
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'font-size');
  token.$value = parseDimensionValue(token.$value);
};

/**
 * @description Upgrade a lineHeight token (determine type, parse value if needed)
 */
const upgradeLineHeightToken = (token: BaseDesignToken, rootConfig: Record<string, unknown>): void => {
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'line-height');

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
 * @description Upgrade a color token (parse legacy color strings to modern format)
 */
const upgradeColorToken = (token: BaseDesignToken): void => {
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    try {
      token.$value = parseColor(token.$value);
    } catch {
      // If parsing fails, leave the value as is - schema validation will catch it
    }
  }
};

/**
 * @description Upgrade a number token (set line-height subtype if applicable)
 */
const upgradeNumberToken = (token: BaseDesignToken, path: string[]): void => {
  if (path.includes('line-height')) {
    setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'line-height');
  }
};

/**
 * @description Upgrade a legacy fontFamilies token (convert to fontFamily type and parse value)
 */
const upgradeLegacyFontFamiliesToken = (token: BaseDesignToken): void => {
  token.$type = 'fontFamily';
  if (typeof token.$value === 'string') {
    token.$value = legacyToModernFontFamily.decode(token.$value);
  }
};

/**
 * @description Upgrade a fontFamily token with legacy string value (parse to array/string)
 */
const upgradeFontFamilyTokenWithLegacyValue = (token: BaseDesignToken): void => {
  if (typeof token.$value === 'string' && !isRef(token.$value)) {
    token.$value = legacyToModernFontFamily.decode(token.$value);
  }
};

/**
 * @description NLDS themes use $type: fontSize and lineHeight instead of number/dimension, so a quick round of preprocessing helps to get them in order.
 */
export const upgradeLegacyTokens = (rootConfig: Record<string, unknown>): Record<string, unknown> => {
  walkTokens(rootConfig, (token, path) => {
    switch (token.$type) {
      case 'dimension':
        upgradeDimensionToken(token, path);
        break;
      case 'fontSize':
        upgradeFontSizeToken(token);
        break;
      case 'lineHeight':
        upgradeLineHeightToken(token, rootConfig);
        break;
      case 'color':
        upgradeColorToken(token);
        break;
      case 'number':
        upgradeNumberToken(token, path);
        break;
      case 'fontFamilies':
        upgradeLegacyFontFamiliesToken(token);
        break;
      case 'fontFamily':
        upgradeFontFamilyTokenWithLegacyValue(token);
        break;
    }
  });
  return rootConfig;
};
