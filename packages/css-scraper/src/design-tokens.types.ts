import {
  ColorTokenSchema,
  ModernDimensionTokenSchema,
  ModernFontFamilyTokenSchema,
  ModernFontFamilyNameSchema,
} from '@nl-design-system-community/design-tokens-schema';
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
