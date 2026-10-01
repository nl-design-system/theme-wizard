import {
  ColorTokenSchema,
  ModernDimensionTokenSchema,
  ModernFontFamilyTokenSchema,
  ModernFontFamilyNameSchema,
  EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES,
  EXTENSION_SCRAPED_SUBTYPE,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/design-tokens-schema';
import * as z from 'zod';

export {
  EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES,
  EXTENSION_SCRAPED_SUBTYPE,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
};

export const TokenExtensionsSchema = z.object({
  [EXTENSION_AUTHORED_AS]: z.string().trim(),
  [EXTENSION_CSS_PROPERTIES]: z.array(z.string().trim()),
  [EXTENSION_SCRAPED_SUBTYPE]: z.literal('font-size').optional(),
  [EXTENSION_TOKEN_ID]: z.string().trim(),
  [EXTENSION_USAGE_COUNT]: z.int().positive(),
});
export type TokenExtensions = z.infer<typeof TokenExtensionsSchema>;

export const ScrapedColorTokenSchema = z.strictObject({
  ...ColorTokenSchema.shape,
  $extensions: TokenExtensionsSchema,
});
export type ScrapedColorToken = z.infer<typeof ScrapedColorTokenSchema>;

export const ScrapedDimensionTokenSchema = z.strictObject({
  ...ModernDimensionTokenSchema.shape,
  $extensions: TokenExtensionsSchema,
});
export type ScrapedDimensionToken = z.infer<typeof ScrapedDimensionTokenSchema>;

export const ScrapedFontFamilyTokenSchema = z.strictObject({
  ...ModernFontFamilyTokenSchema.shape,
  $extensions: TokenExtensionsSchema,
  // Force font-families to be an Array because that's what css-design-tokens returns
  $value: z.array(ModernFontFamilyNameSchema),
});
export type ScrapedFontFamilyToken = z.infer<typeof ScrapedFontFamilyTokenSchema>;

export const ScrapedDesignTokenSchema = z.union([
  ScrapedFontFamilyTokenSchema,
  ScrapedDimensionTokenSchema,
  ScrapedColorTokenSchema,
]);
export type ScrapedDesignToken = z.infer<typeof ScrapedDesignTokenSchema>;
