import { z } from '@hono/zod-openapi';

const WallaceExtensions = z.object({
  'com.projectwallace.css-authored-as': z.string(),
  'com.projectwallace.usage-count': z.int().positive(),
});

const ColorComponent = z.union([z.number(), z.literal('none')]);

const ColorValue = z.strictObject({
  alpha: z.number().gte(0).lte(1),
  colorSpace: z.string(),
  components: z.tuple([ColorComponent, ColorComponent, ColorComponent]),
});

const Color = z.strictObject({
  $extensions: WallaceExtensions.extend({
    'com.projectwallace.css-properties': z.array(z.string()),
  }),
  $type: z.literal('color'),
  $value: ColorValue,
});

const DimensionValue = z.strictObject({
  unit: z.string(),
  value: z.number(),
});

const Dimension = z.object({
  $extensions: WallaceExtensions,
  $type: z.literal('dimension'),
  $value: DimensionValue,
});

const UnparsedToken = z.object({
  $extensions: WallaceExtensions,
  $type: z.never(),
  $value: z.string(),
});

const FontFamilyValue = z.array(z.string());

const FontFamily = z.strictObject({
  $extensions: WallaceExtensions,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValue,
});

export const DesignTokens = z
  .strictObject({
    colors: z.record(z.string(), Color),
    fontFamilies: z.record(z.string(), FontFamily),
    fontSizes: z.record(z.string(), z.union([Dimension, UnparsedToken])),
  })
  .openapi({
    type: 'object',
  });
