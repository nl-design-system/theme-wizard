import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema } from './tokens/base-token';
import { ColorTokenValidationSchema } from './tokens/color-token';
import { FontFamilyTokenSchema } from './tokens/fontfamily-token';
export { EXTENSION_RESOLVED_FROM, EXTENSION_RESOLVED_AS } from './resolve-refs';

export const ColorOrColorScaleSchema = z.union([
  ColorTokenValidationSchema,
  // For now we allow basic design tokens names, eventually we may want to consider only allowing
  // 1 | 2 | 3 | 5..12 | accent
  z.record(BaseDesignTokenIdentifierSchema, ColorTokenValidationSchema),
]);
export type ColorOrColorScale = z.infer<typeof ColorOrColorScaleSchema>;

const ColorIdentifierSchema = BaseDesignTokenIdentifierSchema;

export const BrandSchema = z.looseObject({
  name: z.looseObject({
    $type: z.literal('text'),
    $value: z.string(),
  }),
  color: z.record(ColorIdentifierSchema, ColorOrColorScaleSchema).optional(),
});
export type Brand = z.infer<typeof BrandSchema>;

export const BrandsSchema = z.record(
  BaseDesignTokenIdentifierSchema, // ex.: "ma", "utrecht", "denhaag"
  BrandSchema,
);

export type Brands = z.infer<typeof BrandsSchema>;

export const FOREGROUND_COLOR_KEYS = [
  'border-active',
  'border-default',
  'border-hover',
  'border-subtle',
  'color-active',
  'color-default',
  'color-document',
  'color-hover',
  'color-subtle',
] as const;
export type ForegroundColorKey = (typeof FOREGROUND_COLOR_KEYS)[number];

export const BACKGROUND_COLOR_KEYS = ['bg-active', 'bg-default', 'bg-document', 'bg-hover', 'bg-subtle'] as const;
export type BackgroundColorKey = (typeof BACKGROUND_COLOR_KEYS)[number];

export const COLOR_KEYS = [...BACKGROUND_COLOR_KEYS, ...FOREGROUND_COLOR_KEYS] as const;
export type ColorNameKey = (typeof COLOR_KEYS)[number];

export const ColorNameSchema = z.strictObject(
  Object.fromEntries(COLOR_KEYS.map((key) => [key, ColorTokenValidationSchema.optional()])),
);
export type ColorName = z.infer<typeof ColorNameSchema>;

export type ContrastRequirement = Partial<Record<ForegroundColorKey, Partial<Record<BackgroundColorKey, number>>>>;
/** @see https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#as-2-toepassing */
export const CONTRAST: ContrastRequirement = {
  'border-active': {
    'bg-active': 3,
  },
  'border-default': {
    'bg-default': 3,
  },
  'border-hover': {
    'bg-hover': 3,
  },
  'color-active': {
    'bg-active': 4.5,
  },
  'color-default': {
    'bg-default': 4.5,
  },
  'color-document': {
    'bg-subtle': 4.5,
  },
  'color-hover': {
    'bg-hover': 4.5,
  },
} as const;
export const SKIP_CONTRAST_EXTENSION = new Set(['disabled', 'disabled-inverse']);

export const BasisColorSchema = z.strictObject({
  'accent-1': ColorNameSchema.optional(),
  'accent-1-inverse': ColorNameSchema.optional(),
  'accent-2': ColorNameSchema.optional(),
  'accent-2-inverse': ColorNameSchema.optional(),
  'accent-3': ColorNameSchema.optional(),
  'accent-3-inverse': ColorNameSchema.optional(),
  'action-1': ColorNameSchema.optional(),
  'action-1-inverse': ColorNameSchema.optional(),
  'action-2': ColorNameSchema.optional(),
  'action-2-inverse': ColorNameSchema.optional(),
  default: ColorNameSchema.optional(),
  'default-inverse': ColorNameSchema.optional(),
  disabled: ColorNameSchema.optional(),
  'disabled-inverse': ColorNameSchema.optional(),
  highlight: ColorNameSchema.optional(),
  'highlight-inverse': ColorNameSchema.optional(),
  info: ColorNameSchema.optional(),
  'info-inverse': ColorNameSchema.optional(),
  negative: ColorNameSchema.optional(),
  'negative-inverse': ColorNameSchema.optional(),
  positive: ColorNameSchema.optional(),
  'positive-inverse': ColorNameSchema.optional(),
  selected: ColorNameSchema.optional(),
  'selected-inverse': ColorNameSchema.optional(),
  transparent: ColorTokenValidationSchema.optional(),
  warning: ColorNameSchema.optional(),
  'warning-inverse': ColorNameSchema.optional(),
});
export type BasisColor = z.infer<typeof BasisColorSchema>;

export const BasisTextSchema = z.looseObject({
  'font-family': z
    .looseObject({
      default: FontFamilyTokenSchema.optional(),
      monospace: FontFamilyTokenSchema.optional(),
    })
    .optional(),
  // 'font-size': z.looseObject({}).optional(),
  // 'font-weight': z.looseObject({}).optional(),
  // 'line-height': z.looseObject({}).optional(),
});

export const FormControlStateSchema = z.looseObject({
  'accent-color': ColorTokenValidationSchema.optional(),
  'background-color': ColorTokenValidationSchema.optional(),
  'border-color': ColorTokenValidationSchema.optional(),
  color: ColorTokenValidationSchema.optional(),
});
export type FormControlState = z.infer<typeof FormControlStateSchema>;

export const BasisTokensSchema = z.looseObject({
  color: BasisColorSchema.optional(),
  // action: z.strictObject({}),
  // 'border-radius': z.strictObject({}),
  // 'border-width': z.strictObject({}),
  // 'box-shadow': z.strictObject({}),
  // dataset: z.strictObject({}),
  // focus: z.strictObject({}),
  'form-control': z
    .looseObject({
      ...FormControlStateSchema.shape,
      active: FormControlStateSchema.optional(),
      disabled: FormControlStateSchema.optional(),
      focus: FormControlStateSchema.optional(),
      'font-family': FontFamilyTokenSchema.optional(),
      hover: FormControlStateSchema.optional(),
      invalid: FormControlStateSchema.optional(),
      placeholder: z
        .looseObject({
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      'read-only': FormControlStateSchema.optional(),
    })
    .optional(),
  heading: z
    .looseObject({
      color: ColorTokenValidationSchema.optional(),
      'font-family': FontFamilyTokenSchema.optional(),
    })
    .optional(),
  // page: z.strictObject({}),
  // 'pointer-target': z.strictObject({}),
  // size: z.strictObject({}),
  // space: z.strictObject({
  //   block: {},
  //   columns: {},
  //   inline: {},
  //   row: {},
  //   text: {},
  // }),
  text: BasisTextSchema.optional(),
});
export type BasisTokens = z.infer<typeof BasisTokensSchema>;
