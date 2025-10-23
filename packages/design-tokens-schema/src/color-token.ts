import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.1 -> 4.1 Color
// https://www.designtokens.org/tr/drafts/color/#format

export const ColorComponentSchema = z.union([z.number(), z.literal('none')]);
export type ColorComponent = z.infer<typeof ColorComponentSchema>;

const spaces = [
  'a98-rgb',
  'display-p3',
  'hsl',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'prophoto-rgb',
  'rec2020',
  'srgb',
  'xyz-d50',
  'xyz-d65',
] as const;

export const COLOR_SPACES = Object.fromEntries(spaces.map((space) => [space, space]));

export const ColorSpaceSchema = z.union(spaces.map((space) => z.literal(space)));
export type ColorSpace = z.infer<typeof ColorSpaceSchema>;

export const ColorValueSchema = z.strictObject({
  alpha: z.number().gte(0).lte(1),
  colorSpace: ColorSpaceSchema,
  components: z.tuple([ColorComponentSchema, ColorComponentSchema, ColorComponentSchema]),
});
export type ColorValue = z.infer<typeof ColorValueSchema>;

export const ColorTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('color'),
  $value: ColorValueSchema,
});
export type ColorToken = z.infer<typeof ColorTokenSchema>;
