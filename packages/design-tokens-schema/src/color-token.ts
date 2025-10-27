import Color, { type Coords } from 'colorjs.io';
import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

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

export const ColorAlphaSchema = z.number().gte(0).lte(1);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorAlpha = z.infer<typeof ColorAlphaSchema>;

export const ColorHexFallbackSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorHexFallback = z.infer<typeof ColorHexFallbackSchema>;

export const ColorValueSchema = z.strictObject({
  alpha: ColorAlphaSchema.optional(),
  colorSpace: ColorSpaceSchema.nonoptional(),
  components: z.tuple([ColorComponentSchema, ColorComponentSchema, ColorComponentSchema]).nonoptional(),
  hex: ColorHexFallbackSchema.optional(),
});
export type ColorValue = z.infer<typeof ColorValueSchema>;

export const LegacyColorTokenSchema = BaseDesignTokenValueSchema.extend({
  $type: z.literal('color'),
  $value: z.string(),
});

export const ColorTokenSchema = BaseDesignTokenValueSchema.extend({
  $type: z.literal('color'),
  $value: ColorValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/color/#format */
export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const parseColor = (color: string): ColorValue => {
  try {
    const parsedColor = new Color(color);
    return {
      alpha: parsedColor.alpha,
      colorSpace: parsedColor.spaceId as ColorSpace,
      components: parsedColor.coords,
    };
  } catch {
    // A catch for edge cases that we don't support yet.
    return {
      alpha: 1,
      colorSpace: 'srgb',
      components: [0, 0, 0],
    };
  }
};

export const stringifyColor = (color: ColorValue): string => {
  const reference = new Color({
    alpha: color.alpha,
    coords: color.components.map((component) => (component === 'none' ? 0 : component)) as Coords,
    spaceId: color.colorSpace,
  });
  const converted = reference.to('srgb');
  return converted.toString({
    // Collapse prevents using the shorthand notation
    collapse: false,
    format: 'hex',
    inGamut: true,
  });
};

/**
 * @description Convert back and forth between a legacy color value and a modern value
 * @example
 * ```ts
 * legacyToModernColor.decode('#000');
 * //=> { alpha: 1, components: [0, 0, 0], colorSpace: 'rgb' }
 *
 * legacyToModernColor.encode({ alpha: 1, components: [0, 0, 0], colorSpace: 'rgb' })
 * //=> `#000`
 * ```
 */
export const legacyToModernColor = z.codec(z.string(), ColorValueSchema, {
  decode: (value) => parseColor(value),
  encode: (value) => stringifyColor(value),
});

/** @description Validation schema that allows legacy color tokens and upgrades them to modern */
export const ColorTokenValidationSchema = z.union([LegacyColorTokenSchema, ColorTokenSchema]).transform((token) => {
  // Token already is modern format
  if (typeof token.$value !== 'string') return token;

  return {
    ...token,
    $value: legacyToModernColor.decode(token.$value),
  };
});
