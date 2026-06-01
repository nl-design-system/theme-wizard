import dlv from 'dlv';
import * as z from 'zod';
import { BaseDesignTokenSchema } from './tokens/base-token';
import { ColorTokenValidationSchema } from './tokens/color-token';
import { DimensionTokenSchema } from './tokens/dimension-token';
import { FontFamilyTokenSchema } from './tokens/fontfamily-token';

/**
 * Map all known `css-syntax` extensions to one of the documented DTCG token $types
 */
const CSS_SYNTAX_TO_DTCG_TYPE: Record<string, string> = {
  '["<cursor-image>", "<cursor-predefined>"]': 'cursor',
  '["<family-name>", "<generic-name>"]': 'fontFamily',
  '["<length>"]': 'dimension',
  '["<spread-shadow>"]': 'boxShadow',
  '<color>': 'color',
  '<length-percentage>': 'dimension',
  '<length>': 'dimension',
  '<line-style>': 'lineStyle',
  '<number>': 'number',
};

/**
 * Map each of the documented DTCG $types to one of our schemas,
 * using BaseDesignTokenSchema when we don't have a dedicated one
 */
const DTCG_TYPE_TO_SCHEMA: Record<string, z.ZodTypeAny> = {
  boxShadow: BaseDesignTokenSchema,
  color: ColorTokenValidationSchema,
  cursor: BaseDesignTokenSchema,
  dimension: DimensionTokenSchema,
  fontFamily: FontFamilyTokenSchema,
  lineStyle: BaseDesignTokenSchema,
  // Use BaseDesignTokenSchema so that legacy tokens (e.g. lineHeight upgraded to dimension)
  // pass schema validation and reach the custom superRefine validators.
  number: BaseDesignTokenSchema,
};

export const EXTENSION_CSS_PROPERTY_SYNTAX = 'nl.nldesignsystem.css-property-syntax';

const MODERN_SYNTAX_PATH = ['$extensions', EXTENSION_CSS_PROPERTY_SYNTAX];
const LEGACY_SYNTAX_PATH = ['extensions', EXTENSION_CSS_PROPERTY_SYNTAX];

/**
 * Generate a Design Tokens Zod schema on the fly by passing in token definitions as commonly used in NL Design System
 * @param node An NL Design System tokens.json definition structure
 * @returns Zod schema with all node-based validations for all supported design tokens
 */
export const buildSchema = (node: Record<string, unknown>): z.ZodTypeAny => {
  if ('$type' in node) {
    // Look in both legacy extensions and modern $extensions because some design token JSON files
    // might use the legacy format.
    const syntax = dlv(node, MODERN_SYNTAX_PATH) ?? dlv(node, LEGACY_SYNTAX_PATH);
    const dtcgType = typeof syntax === 'string' ? CSS_SYNTAX_TO_DTCG_TYPE[syntax] : undefined;
    return DTCG_TYPE_TO_SCHEMA[dtcgType ?? ''] ?? BaseDesignTokenSchema;
  }
  const shape: Record<string, z.ZodTypeAny> = Object.create(null);
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$')) {
      shape[key] = buildSchema(value as Record<string, unknown>);
    }
  }
  return z.strictObject(shape);
};
