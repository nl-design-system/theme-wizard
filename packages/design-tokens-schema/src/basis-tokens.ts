import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema, BaseDesignTokenValueSchema } from './base-token';
import { ColorTokenValidationSchema } from './color-token';

export const ColorOrColorScaleSchema = z.union([
  ColorTokenValidationSchema,
  // For now we allow basic design tokens names, eventually we may want to consider only allowing
  // 1 | 2 | 3 | 5..12 | accent
  z.record(BaseDesignTokenIdentifierSchema, ColorTokenValidationSchema),
]);

const ColorIdentifierSchema = BaseDesignTokenIdentifierSchema;

export const BrandSchema = z.object({
  name: z.object({
    $type: z.literal('text'),
    $value: z.string(),
  }),
  color: z.record(ColorIdentifierSchema, ColorOrColorScaleSchema).optional(),
});

export const BrandsSchema = z.record(
  BaseDesignTokenIdentifierSchema, // ex.: "ma", "utrecht", "denhaag"
  BrandSchema,
);

// A JSONRef:
// - Starts with {
// - Ends with }
// - Contains only BaseDesignTokenNameSchema, joined by a . character
export const JsonRefSchema = z
  .string()
  .trim()
  .startsWith('{')
  .endsWith('}')
  .transform((value) => {
    return value
      .slice(1, -1) // remove { and }
      .split('.'); // Get the individual parts
  })
  // Validate that each part is a valid identifier
  .pipe(z.array(BaseDesignTokenIdentifierSchema))
  // Join them back together
  .transform((value) => `{${value.join('.')}}`);

export const ColorWithRefSchema = BaseDesignTokenValueSchema.extend({
  $type: z.literal('color'),
  $value: JsonRefSchema,
});

export const ColorOrRefSchema = z.union([ColorWithRefSchema]);
export type ColorOrRef = z.infer<typeof ColorOrRefSchema>;

export const ColorNameSchema = z.strictObject({
  'bg-active': ColorOrRefSchema.optional(),
  'bg-default': ColorOrRefSchema.optional(),
  'bg-document': ColorOrRefSchema.optional(),
  'bg-hover': ColorOrRefSchema.optional(),
  'bg-subtle': ColorOrRefSchema.optional(),
  'border-active': ColorOrRefSchema.optional(),
  'border-default': ColorOrRefSchema.optional(),
  'border-hover': ColorOrRefSchema.optional(),
  'border-subtle': ColorOrRefSchema.optional(),
  'color-active': ColorOrRefSchema.optional(),
  'color-default': ColorOrRefSchema.optional(),
  'color-document': ColorOrRefSchema.optional(),
  'color-hover': ColorOrRefSchema.optional(),
  'color-subtle': ColorOrRefSchema.optional(),
});

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
  transparent: ColorOrRefSchema.optional(),
  warning: ColorNameSchema.optional(),
  'warning-inverse': ColorNameSchema.optional(),
});

export const BasisTokensSchema = z.object({
  color: BasisColorSchema.optional(),
  // action: z.strictObject({}),
  // 'border-radius': z.strictObject({}),
  // 'border-width': z.strictObject({}),
  // 'box-shadow': z.strictObject({}),
  // focus: z.strictObject({}),
  // 'form-control': z.strictObject({}),
  // heading: z.strictObject({}),
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
  // text: z.strictObject({
  //   'font-family': z.strictObject({}),
  //   'font-size': z.strictObject({}),
  //   'font-weight': z.strictObject({}),
  //   'line-height': z.strictObject({}),
  // }),
});

export const CommonSchema = z.object({
  basis: BasisTokensSchema.optional(),
});

export const ThemeSchema = z.looseObject({
  // $metadata: z.strictObject({
  //   tokensSetOrder: z.array(z.string()),
  // }),
  // $themes: [],
  brand: BrandsSchema.optional(),
  common: CommonSchema.optional(),
  // 'components/*': {},
});
