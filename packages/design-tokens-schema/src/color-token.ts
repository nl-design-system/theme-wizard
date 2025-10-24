import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.1 Color -> 4.1 Color Module: Format

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

/** @see https://www.designtokens.org/tr/drafts/color/#supported-color-spaces */
export const COLOR_SPACES = Object.fromEntries(spaces.map((space) => [space, space])) as Record<
  (typeof spaces)[number],
  (typeof spaces)[number]
>;

export const ColorSpaceSchema = z.union(spaces.map((space) => z.literal(space)));

export const NoneKeywordSchema = z.literal('none');

/** @see https://www.designtokens.org/tr/drafts/color/#the-none-keyword */
export type NoneKeyword = z.infer<typeof NoneKeywordSchema>;

/** @see https://www.designtokens.org/tr/drafts/color/#supported-color-spaces */
export type ColorSpace = z.infer<typeof ColorSpaceSchema>;

export const ColorComponentSchema = z.union([z.number(), NoneKeywordSchema]);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorComponent = z.infer<typeof ColorComponentSchema>;

export const ColorAlphaSchema = z.number().gte(0).lte(1);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorAlpha = z.infer<typeof ColorAlphaSchema>;

export const ColorHexFallbackSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorHexFallback = z.infer<typeof ColorHexFallbackSchema>;

export const ColorValueSchema = z.strictObject({
  alpha: ColorAlphaSchema.optional().default(1),
  colorSpace: ColorSpaceSchema.nonoptional(),
  components: z.tuple([ColorComponentSchema, ColorComponentSchema, ColorComponentSchema]).nonoptional(),
  hex: ColorHexFallbackSchema.optional(),
});
export type ColorValue = z.infer<typeof ColorValueSchema>;

export const ColorTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('color'),
  $value: ColorValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorToken = z.infer<typeof ColorTokenSchema>;
