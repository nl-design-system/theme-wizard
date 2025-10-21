import { z } from 'zod';

export const EXTENSION_TOKEN_ID = 'nl.nldesignsystem.theme-wizard.token-id';
export const EXTENSION_USAGE_COUNT = 'nl.nldesignsystem.theme-wizard.usage-count';
export const EXTENSION_AUTHORED_AS = 'nl.nldesignsystem.theme-wizard.css-authored-as';
export const EXTENSION_CSS_PROPERTIES = 'nl.nldesignsystem.theme-wizard.css-properties';

export const TokenExtensionsSchema = z.object({
  [EXTENSION_AUTHORED_AS]: z.string(),
  [EXTENSION_CSS_PROPERTIES]: z.array(z.string()),
  [EXTENSION_TOKEN_ID]: z.string(),
  [EXTENSION_USAGE_COUNT]: z.int().positive(),
});
export type TokenExtensions = z.infer<typeof TokenExtensionsSchema>;

export const ColorComponentSchema = z.union([z.number(), z.literal('none')]);
export type ColorComponent = z.infer<typeof ColorComponentSchema>;

export const ColorSpaceSchema = z.union([
  z.literal('srgb'),
  z.literal('display-p3'),
  z.literal('hsl'),
  z.literal('hwb'),
  z.literal('lab'),
  z.literal('lch'),
  z.literal('oklab'),
  z.literal('oklch'),
  z.literal('display-p3'),
  z.literal('a98-rgb'),
  z.literal('prophoto-rgb'),
  z.literal('rec2020'),
  z.literal('xyz-d65'),
  z.literal('xyz-d50'),
]);
export type ColorSpace = z.infer<typeof ColorSpaceSchema>;

export const ColorValueSchema = z.strictObject({
  alpha: z.number().gte(0).lte(1),
  colorSpace: ColorSpaceSchema,
  components: z.tuple([ColorComponentSchema, ColorComponentSchema, ColorComponentSchema]),
});
export type ColorValue = z.infer<typeof ColorValueSchema>;

export const ColorTokenSchema = z.strictObject({
  $extensions: TokenExtensionsSchema,
  $type: z.literal('color'),
  $value: ColorValueSchema,
});
export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const DimensionValueSchema = z.strictObject({
  unit: z.string(),
  value: z.number(),
});
export type DimensionValue = z.infer<typeof DimensionValueSchema>;

export const DimensionTokenSchema = z.object({
  $extensions: TokenExtensionsSchema,
  $type: z.literal('dimension'),
  $value: DimensionValueSchema,
});
export type DimensionToken = z.infer<typeof DimensionTokenSchema>;

export const FontFamilyValueSchema = z.array(z.string());
export type FontFamilyValue = z.infer<typeof FontFamilyValueSchema>;

export const FontFamilyTokenSchema = z.strictObject({
  $extensions: TokenExtensionsSchema,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValueSchema,
});
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;

export const DesignTokenSchema = z.union([FontFamilyTokenSchema, DimensionTokenSchema, ColorTokenSchema]);
export type DesignToken = z.infer<typeof DesignTokenSchema>;
