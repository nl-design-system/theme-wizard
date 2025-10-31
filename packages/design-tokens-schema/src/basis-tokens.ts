import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema, BaseDesignTokenValueSchema } from './base-token';
import { ColorTokenValidationSchema } from './color-token';
import { FontFamilyTokenSchema } from './fontfamily-token';
import { validateRefs, resolveRefs } from './resolve-refs';

export const ColorOrColorScaleSchema = z.union([
  ColorTokenValidationSchema,
  // For now we allow basic design tokens names, eventually we may want to consider only allowing
  // 1 | 2 | 3 | 5..12 | accent
  z.record(BaseDesignTokenIdentifierSchema, ColorTokenValidationSchema),
]);
export type ColorOrColorScale = z.infer<typeof ColorOrColorScaleSchema>;

const ColorIdentifierSchema = BaseDesignTokenIdentifierSchema;

export const BrandSchema = z.object({
  name: z.object({
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

// A Design Token ref:
// - Starts with {
// - Ends with }
// - Contains only BaseDesignTokenNameSchema, joined by a . character
export const TokenReferenceSchema = z
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
export type TokenReference = z.infer<typeof TokenReferenceSchema>;

export const ColorWithRefSchema = BaseDesignTokenValueSchema.extend({
  $type: z.literal('color'),
  $value: TokenReferenceSchema,
});
export type ColorWithRef = z.infer<typeof ColorWithRefSchema>;

export const ColorOrRefSchema = z.union([ColorTokenValidationSchema, z.looseObject({ ...ColorWithRefSchema.shape })]);
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
export type ColorName = z.infer<typeof ColorNameSchema>;

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
export type BasisColor = z.infer<typeof BasisColorSchema>;

export const BasisTextSchema = z.object({
  'font-family': z
    .object({
      default: FontFamilyTokenSchema.optional(),
      monospace: FontFamilyTokenSchema.optional(),
    })
    .optional(),
  // 'font-size': z.looseObject({}).optional(),
  // 'font-weight': z.looseObject({}).optional(),
  // 'line-height': z.looseObject({}).optional(),
});

export const BasisTokensSchema = z.object({
  color: BasisColorSchema.optional(),
  // action: z.strictObject({}),
  // 'border-radius': z.strictObject({}),
  // 'border-width': z.strictObject({}),
  // 'box-shadow': z.strictObject({}),
  // dataset: z.strictObject({}),
  // focus: z.strictObject({}),
  'form-control': z
    .object({
      'accent-color': ColorTokenValidationSchema.optional(),
      active: z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      'background-color': ColorTokenValidationSchema.optional(),
      'border-color': ColorTokenValidationSchema.optional(),
      color: ColorTokenValidationSchema.optional(),
      disabled: z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      focus: z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      'font-family': FontFamilyTokenSchema.optional(),
      hover: z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      invalid: z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      placeholder: z
        .object({
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      'read-only': z
        .object({
          'accent-color': ColorTokenValidationSchema.optional(),
          'background-color': ColorTokenValidationSchema.optional(),
          'border-color': ColorTokenValidationSchema.optional(),
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
    })
    .optional(),
  heading: z
    .object({
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

export const CommonSchema = z.object({
  basis: BasisTokensSchema.optional(),
});
export type Common = z.infer<typeof CommonSchema>;

export const resolveConfigRefs = (rootConfig: Theme) => {
  // Clone the input root because resolveRefs is a mutable operation
  const resolvedRoot = structuredClone(rootConfig);
  resolveRefs(resolvedRoot.common, rootConfig.brand);
  return resolvedRoot;
};

/**
 * Validate a full theme
 * If you want to replace all tokens refs with their actual value, tag on a `.transform(resolveConfigRefs)`
 *
 * @example
 * ```ts
 * const validated = ThemeSchema.safeParse(yourTokensJson);
 * const refsReplacedWithActualValues = ThemeSchema.transform(resolveConfigRefs).safeParse(yourTokensJson);
 * ```
 */
export const ThemeSchema = z
  .looseObject({
    // $metadata: z.strictObject({
    //   tokensSetOrder: z.array(z.string()),
    // }),
    // $themes: [],
    brand: BrandsSchema.optional(),
    common: CommonSchema.optional(),
    // 'components/*': {},
  })
  .refine((root) => {
    return validateRefs(root.common, root.brand);
  });

export type Theme = z.infer<typeof ThemeSchema>;
