import { parse_dimension } from '@projectwallace/css-parser';
import { setExtension } from './extensions';
import { resolveRef } from './resolve-refs';
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

  return { type: 'lineHeight' };
};

/**
 * @description NLDS themes use $type: fontSize and lineHeight instead of number/dimension, so a quick round of preprocessing helps to get them in order.
 */
export const upgradeLegacyTokens = (rootConfig: Record<string, unknown>): Record<string, unknown> => {
  walkTokens(rootConfig, (token) => {
    if (token.$type === 'fontSize') {
      token.$type = 'dimension';
      setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'font-size');
      return;
    }

    if (token.$type === 'lineHeight') {
      setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'line-height');

      // Only change the $type if the $value is already a number
      if (typeof token.$value === 'number') {
        token.$type = 'number';
        return;
      }

      // If the value is a ref, make sure that the $type is the same as the ref to avoid errors about incompatible types
      if (isRef(token.$value)) {
        // Resolve the reference to determine what type the target will be
        const refToken = resolveRef(rootConfig, token.$value);
        if (isTokenLike(refToken)) {
          const { type } = processLineHeightValue(refToken.$value);
          token.$type = type;
        }
        return;
      }

      if (typeof token.$value === 'string') {
        const { type, value } = processLineHeightValue(token.$value);
        token.$type = type;
        if (value !== undefined) {
          token.$value = value;
        }
      }
    }
  });
  return rootConfig;
};
