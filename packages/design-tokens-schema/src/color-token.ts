import Color, { type Coords } from 'colorjs.io';
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

// https://github.com/projectwallace/css-design-tokens/blob/main/src/colors.ts#L1-L92
export const parseColor = (color: string): ColorValue => {
  const lowercased = color.toLowerCase();

  // The keyword "transparent" specifies a transparent black.
  // > https://drafts.csswg.org/css-color-4/#transparent-color
  // colorjs.io does not handle this well so we need to do it ourselves
  if (lowercased === 'transparent') {
    return {
      alpha: 0,
      colorSpace: 'srgb',
      components: [0, 0, 0],
    };
  }

  try {
    const parsedColor = new Color(color);
    return {
      alpha: parsedColor.alpha ?? 0,
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
  return converted.toString({ inGamut: true });
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
  decode: (color) => parseColor(color),
  encode: (modernColorTokenValue) => stringifyColor(modernColorTokenValue),
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
