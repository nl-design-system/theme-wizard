import { z } from '@hono/zod-openapi';
import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/css-scraper';

const TokenExtensions = z.object({
  [EXTENSION_AUTHORED_AS]: z.string(),
  [EXTENSION_CSS_PROPERTIES]: z.array(z.string()),
  [EXTENSION_TOKEN_ID]: z.string(),
  [EXTENSION_USAGE_COUNT]: z.int().positive(),
});

const ColorComponent = z.union([z.number(), z.literal('none')]);

const ColorValue = z.strictObject({
  alpha: z.number().gte(0).lte(1),
  colorSpace: z.string(),
  components: z.tuple([ColorComponent, ColorComponent, ColorComponent]),
});

export const ColorToken = z.strictObject({
  $extensions: TokenExtensions,
  $type: z.literal('color'),
  $value: ColorValue,
});

const DimensionValue = z.strictObject({
  unit: z.string(),
  value: z.number(),
});

export const DimensionToken = z.object({
  $extensions: TokenExtensions,
  $type: z.literal('dimension'),
  $value: DimensionValue,
});

const FontFamilyValue = z.array(z.string());

export const FontFamilyToken = z.strictObject({
  $extensions: TokenExtensions,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValue,
});

export const DesignToken = z.union([FontFamilyToken, DimensionToken, ColorToken]);
