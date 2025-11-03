import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema } from './base-token';
import { ColorTokenValidationSchema, compareContrast, stringifyColor, ColorTokenSchema } from './color-token';
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

const COLOR_NAME_KEYS = [
  'bg-active',
  'bg-default',
  'bg-document',
  'bg-hover',
  'bg-subtle',
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

type ColorNameKey = (typeof COLOR_NAME_KEYS)[number];

type ContrastRequirement = Partial<Record<ColorNameKey, Partial<Record<ColorNameKey, number>>>>;

const CONTRAST: ContrastRequirement = {
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
    'color-default': 4.5,
  },
  'color-document': {
    'bg-subtle': 4.5,
  },
  'color-hover': {
    'bg-hover': 4.5,
  },
} as const;

export const ColorNameSchema = z
  .strictObject(Object.fromEntries(COLOR_NAME_KEYS.map((key) => [key, ColorTokenValidationSchema.optional()])))
  .superRefine((colorNames, context) => {
    for (const [foreground, contrastRequirements] of Object.entries(CONTRAST)) {
      for (const [background, expectedContrast] of Object.entries(contrastRequirements)) {
        if (background in colorNames) {
          const foregroundColor = colorNames[foreground];
          const backgroundColor = colorNames[background];
          const foregroundResult = ColorTokenSchema.safeParse(foregroundColor);
          const backgroundResult = ColorTokenSchema.safeParse(backgroundColor);

          if (!foregroundResult.success || !backgroundResult.success) {
            return;
          }

          const result = compareContrast(foregroundResult.data, backgroundResult.data);
          if (result < expectedContrast) {
            context.addIssue({
              code: 'too_small',
              input: result,
              message: `Not enough contrast between \`${foreground}\` (${stringifyColor(foregroundResult.data['$value'])}) and \`${background}\` (${stringifyColor(backgroundResult.data['$value'])}). Calculated ${result}, need ${expectedContrast}`,
              minimum: expectedContrast,
              origin: 'number',
              path: [foreground, '$value'],
            });
          }
        }
      }
    }
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
  transparent: ColorTokenValidationSchema.optional(),
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

export const FormControlStateSchema = z.object({
  'accent-color': ColorTokenValidationSchema.optional(),
  'background-color': ColorTokenValidationSchema.optional(),
  'border-color': ColorTokenValidationSchema.optional(),
  color: ColorTokenValidationSchema.optional(),
});
export type FormControlState = z.infer<typeof FormControlStateSchema>;

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
      ...FormControlStateSchema.shape,
      active: FormControlStateSchema.optional(),
      disabled: FormControlStateSchema.optional(),
      focus: FormControlStateSchema.optional(),
      'font-family': FontFamilyTokenSchema.optional(),
      hover: FormControlStateSchema.optional(),
      invalid: FormControlStateSchema.optional(),
      placeholder: z
        .object({
          color: ColorTokenValidationSchema.optional(),
        })
        .optional(),
      'read-only': FormControlStateSchema.optional(),
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
  .superRefine((root, ctx) => {
    try {
      validateRefs(root.common, root.brand);
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        // The next line is type-safe, but because of that we don't cover all branches
        /* v8 ignore next -- @preserve */
        message: error instanceof Error ? error.message : 'Invalid token reference',
      });
    }
  });

export type Theme = z.infer<typeof ThemeSchema>;
