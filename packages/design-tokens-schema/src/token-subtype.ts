import * as z from 'zod';
import type { BaseDesignToken, TokenPath } from './tokens/base-token';
import { setExtension } from './extensions';
import { walkTokens } from './walker';

export const EXTENSION_TOKEN_SUBTYPE = 'nl.nldesignsystem.token-subtype';

export const DimensionSubtypeSchema = z.enum([
  'font-size',
  'line-height',
  'space-block',
  'space-inline',
  'space-column',
  'space-row',
  'space-text',
  'border-radius',
  'border-width',
  'size',
]);
export type DimensionSubtype = z.infer<typeof DimensionSubtypeSchema>;

export const NumberSubtypeSchema = z.enum(['line-height', 'font-weight']);
export type NumberSubtype = z.infer<typeof NumberSubtypeSchema>;

export const ColorSubtypeSchema = z.enum(['background-color', 'border-color', 'color']);
export type ColorSubtype = z.infer<typeof ColorSubtypeSchema>;

export const TokenSubtypeSchema = z.union([DimensionSubtypeSchema, NumberSubtypeSchema, ColorSubtypeSchema]);
export type TokenSubtype = z.infer<typeof TokenSubtypeSchema>;

/** Set a dimension token sub-type. If the token is not a dimension, this is a no-op */
export const setDimensionSubtype = (token: BaseDesignToken, subtype: DimensionSubtype): void => {
  if (token.$type !== 'dimension') {
    return;
  }
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, subtype);
};

/** Set a number token sub-type. If the token is not a number, this is a no-op */
export const setNumberSubtype = (token: BaseDesignToken, subtype: NumberSubtype): void => {
  if (token.$type !== 'number') {
    return;
  }
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, subtype);
};

/** Set a color token sub-type. If the token is not a color, this is a no-op */
export const setColorSubtype = (token: BaseDesignToken, subtype: ColorSubtype): void => {
  if (token.$type !== 'color') {
    return;
  }
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, subtype);
};

/** Set a dimension or number token sub-type. If the token is not a dimension or number, this is a no-op */
export const setLineHeightSubtype = (token: BaseDesignToken): void => {
  if (token.$type !== 'dimension' && token.$type !== 'number') {
    return;
  }
  setExtension(token, EXTENSION_TOKEN_SUBTYPE, 'line-height' satisfies DimensionSubtype & NumberSubtype);
};

const SUBTYPE_SCHEMA_BY_TOKEN_TYPE: Partial<Record<string, z.ZodTypeAny>> = {
  color: ColorSubtypeSchema,
  dimension: DimensionSubtypeSchema,
  number: NumberSubtypeSchema,
};

/** Get a token's sub-type. Returns undefined when there's no sub-type, or it's not valid for the token's `$type`. */
export const getTokenSubtype = (token: BaseDesignToken): TokenSubtype | undefined => {
  const schema = SUBTYPE_SCHEMA_BY_TOKEN_TYPE[token.$type];
  if (!schema) {
    return undefined;
  }
  const result = schema.safeParse(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]);
  return result.success ? (result.data as TokenSubtype) : undefined;
};

/** True when the token has a sub-type extension set that isn't valid for its `$type` (wrong type, or unrecognised value). */
export const hasInvalidSubtype = (token: BaseDesignToken): boolean => {
  const raw = token.$extensions?.[EXTENSION_TOKEN_SUBTYPE];
  if (raw === undefined) {
    return false;
  }
  return getTokenSubtype(token) === undefined;
};

const addDimensionSubtype = (token: BaseDesignToken, tokenPath: TokenPath): void => {
  const path = tokenPath.join('.');

  if (path.includes('font-size')) {
    setDimensionSubtype(token, 'font-size');
  } else if (path.includes('line-height')) {
    setLineHeightSubtype(token);
  } else if (path.includes('margin-block') || path.includes('padding-block') || path.includes('space.block')) {
    setDimensionSubtype(token, 'space-block');
  } else if (path.includes('margin-inline') || path.includes('padding-inline') || path.includes('space.inline')) {
    setDimensionSubtype(token, 'space-inline');
  } else if (path.includes('column-gap') || path.includes('space.column')) {
    setDimensionSubtype(token, 'space-column');
  } else if (path.includes('row-gap') || path.includes('space.row')) {
    setDimensionSubtype(token, 'space-row');
  } else if (path.includes('space.text')) {
    setDimensionSubtype(token, 'space-text');
  } else if (path.includes('border-radius')) {
    setDimensionSubtype(token, 'border-radius');
  } else if (path.includes('border-') && path.includes('-width')) {
    setDimensionSubtype(token, 'border-width');
  } else if (path.includes('size')) {
    // font-size does not match because that was caught earlier
    setDimensionSubtype(token, 'size');
  }
};

const addColorSubtype = (token: BaseDesignToken, tokenPath: TokenPath): void => {
  const path = tokenPath.join('.');

  if (path.includes('.bg-') || path.endsWith('.background-color')) {
    setColorSubtype(token, 'background-color');
  } else if (path.includes('.border-')) {
    setColorSubtype(token, 'border-color');
  } else if (path.includes('.color-') || path.endsWith('.color')) {
    setColorSubtype(token, 'color');
  }
};

const addNumberSubtype = (token: BaseDesignToken, tokenPath: TokenPath): void => {
  const path = tokenPath.join('.');

  if (path.includes('line-height')) {
    setLineHeightSubtype(token);
  } else if (path.includes('font-weight')) {
    setNumberSubtype(token, 'font-weight');
  }
};

/**
 * @description Add token sub-type extensions to a config that already uses modern token types
 * (`dimension`, `number`, `color`), based on each token's path. Themes that still contain legacy
 * `$type` values (e.g. `fontSize`, `lineHeight`, `fontWeight`) should be run through
 * `upgradeLegacyTokens()` first.
 */
export const addTokenSubTypeExtensions = (rootConfig: Record<string, unknown>): Record<string, unknown> => {
  walkTokens(rootConfig, (token, path) => {
    switch (token.$type) {
      case 'dimension':
        addDimensionSubtype(token, path);
        break;
      case 'color':
        addColorSubtype(token, path);
        break;
      case 'number':
        addNumberSubtype(token, path);
        break;
    }
  });
  return rootConfig;
};
