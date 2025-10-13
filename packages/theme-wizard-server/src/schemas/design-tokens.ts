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

export const ColorToken = z.strictObject({
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

export const DimensionToken = z.object({
  $extensions: WallaceExtensions,
  $type: z.literal('dimension'),
  $value: DimensionValue,
});

export const UnparsedToken = z.strictObject({
  $extensions: WallaceExtensions,
  $type: z.never(),
  $value: z.string(),
});

const FontFamilyValue = z.array(z.string());

export const FontFamilyToken = z.strictObject({
  $extensions: WallaceExtensions,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValue,
});
