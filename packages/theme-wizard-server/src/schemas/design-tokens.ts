import { z } from '@hono/zod-openapi';

const TokenExtensions = z.object({
  'nl.designsystem.theme-wizard.css-authored-as': z.string(),
  'nl.designsystem.theme-wizard.css-properties': z.array(z.string()),
  'nl.designsystem.theme-wizard.token-id': z.string(),
  'nl.designsystem.theme-wizard.usage-count': z.int().positive(),
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
