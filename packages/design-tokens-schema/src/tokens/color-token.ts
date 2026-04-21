import Color, { type Coords } from 'colorjs.io';
import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.1 Color -> 4.1 Color Module: Format

/** @see https://www.designtokens.org/tr/drafts/color/#supported-color-spaces */
export const COLOR_SPACES = {
  A98_RGB: 'a98-rgb',
  DISPLAY_P3: 'display-p3',
  HSL: 'hsl',
  HWB: 'hwb',
  LAB: 'lab',
  LCH: 'lch',
  OKLAB: 'oklab',
  OKLCH: 'oklch',
  PROPHOTO_RGB: 'prophoto-rgb',
  REC2020: 'rec2020',
  SRGB: 'srgb',
  XYZ_D50: 'xyz-d50',
  XYZ_D65: 'xyz-d65',
} as const;

export const ColorSpaceSchema = z.union(Object.values(COLOR_SPACES).map((space) => z.literal(space)));

export const NoneKeywordSchema = z.literal('none');

/** @see https://www.designtokens.org/tr/drafts/color/#the-none-keyword */
export type NoneKeyword = z.infer<typeof NoneKeywordSchema>;

/** @see https://www.designtokens.org/tr/drafts/color/#supported-color-spaces */
export type ColorSpace = z.infer<typeof ColorSpaceSchema>;

export const ColorComponentSchema = z.union([z.number(), NoneKeywordSchema]);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorComponent = z.infer<typeof ColorComponentSchema>;

export const ColorComponentsSchema = z.tuple([ColorComponentSchema, ColorComponentSchema, ColorComponentSchema]);
export type ColorComponents = z.infer<typeof ColorComponentsSchema>;

export const ColorAlphaSchema = z.number().gte(0).lte(1);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorAlpha = z.infer<typeof ColorAlphaSchema>;

export const ColorHexFallbackSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorHexFallback = z.infer<typeof ColorHexFallbackSchema>;

export const ColorValueSchema = z.strictObject({
  alpha: ColorAlphaSchema.optional(),
  colorSpace: ColorSpaceSchema.nonoptional(),
  components: ColorComponentsSchema.nonoptional(),
  hex: ColorHexFallbackSchema.optional(),
});
export type ColorValue = z.infer<typeof ColorValueSchema>;

export const ColorTokenSchema = z.looseObject({
  ...BaseDesignTokenSchema.shape,
  $type: z.literal('color'),
  $value: ColorValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const colorJSToColorValue = (color: Color): ColorValue => ({
  alpha: color.alpha,
  colorSpace: color.spaceId as ColorSpace,
  components: color.coords as ColorComponents,
});

export const parseColor = (color: string): ColorValue => colorJSToColorValue(new Color(color));

export const colorJSToHex = (color: Color): string =>
  color.to('srgb').toString({
    // Collapse prevents using the shorthand notation
    collapse: false,
    format: 'hex',
    inGamut: true,
  });

export const stringifyColor = (color: Color | ColorValue): string => {
  try {
    const reference = color instanceof Color ? color : colorTokenValueToColorJS(color);
    return colorJSToHex(reference);
  } catch {
    console.warn('Could not parse color:', color);
    return '#0000';
  }
};

const ColorReferenceSchema = z.looseObject({
  ...BaseDesignTokenSchema.shape,
  $type: z.literal('color'),
  $value: TokenReferenceSchema,
});
export type ColorWithRef = z.infer<typeof ColorReferenceSchema>;

/** @description Validation schema for color tokens. Legacy color strings are handled by preprocessing. */
export const ColorTokenValidationSchema = z.union([ColorTokenSchema, ColorReferenceSchema]);
export type ValidColor = z.infer<typeof ColorTokenValidationSchema>;

export const colorTokenValueToColorJS = (color: ColorValue): Color => {
  return new Color({
    alpha: color.alpha,
    coords: color.components.map((component) => (component === 'none' ? 0 : component)) as Coords,
    spaceId: color.colorSpace,
  });
};

export const compareContrast = (valueA: ColorValue, valueB: ColorValue): number => {
  const colorA = colorTokenValueToColorJS(valueA);
  const colorB = colorTokenValueToColorJS(valueB);
  return colorA.contrastWCAG21(colorB);
};
