import dlv from 'dlv';
import * as z from 'zod';
import { BaseDesignTokenSchema } from './tokens/base-token';
import { ColorTokenValidationSchema } from './tokens/color-token';
import { DimensionTokenSchema } from './tokens/dimension-token';
import { FontFamilyTokenSchema } from './tokens/fontfamily-token';

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

export const buildSchemaFromNode = (node: Record<string, unknown>): z.ZodTypeAny => {
  if ('$type' in node) {
    // Look in both legacy extensions and modern $extensions because some design token JSON files
    // might use the legacy format.
    const syntax = dlv(node, MODERN_SYNTAX_PATH) ?? dlv(node, LEGACY_SYNTAX_PATH);
    const dtcgType = typeof syntax === 'string' ? CSS_SYNTAX_TO_DTCG_TYPE[syntax] : undefined;
    return DTCG_TYPE_TO_SCHEMA[dtcgType ?? ''] ?? BaseDesignTokenSchema;
  }
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith('$')) {
      shape[key] = buildSchemaFromNode(value as Record<string, unknown>);
    }
  }
  return z.strictObject(shape);
};
