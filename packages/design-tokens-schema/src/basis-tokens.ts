import dlv from 'dlv';
import * as z from 'zod';
import { BaseDesignTokenIdentifierSchema } from './base-token';
import { ColorTokenValidationSchema, ColorValue, compareContrast, type ColorToken } from './color-token';
import { FontFamilyTokenSchema } from './fontfamily-token';
import { validateRefs, resolveRefs, EXTENSION_RESOLVED_FROM, EXTENSION_RESOLVED_AS } from './resolve-refs';
import { TokenReference, isValueObject, isRef } from './token-reference';
import { walkColors, walkObject } from './walker';
export { EXTENSION_RESOLVED_FROM, EXTENSION_RESOLVED_AS } from './resolve-refs';

export const EXTENSION_CONTRAST_WITH = 'nl.nldesignsystem.contrast-with';

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

const FOREGROUND_COLOR_KEYS = [
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
type ForegroundColorKey = (typeof FOREGROUND_COLOR_KEYS)[number];

const BACKGROUND_COLOR_KEYS = ['bg-active', 'bg-default', 'bg-document', 'bg-hover', 'bg-subtle'] as const;
type BackgroundColorKey = (typeof BACKGROUND_COLOR_KEYS)[number];

const COLOR_KEYS = [...BACKGROUND_COLOR_KEYS, ...FOREGROUND_COLOR_KEYS] as const;
export type ColorNameKey = (typeof COLOR_KEYS)[number];

export const ColorNameSchema = z.strictObject(
  Object.fromEntries(COLOR_KEYS.map((key) => [key, ColorTokenValidationSchema.optional()])),
);
export type ColorName = z.infer<typeof ColorNameSchema>;

type ContrastRequirement = Partial<Record<ForegroundColorKey, Partial<Record<BackgroundColorKey, number>>>>;
/** @see https://nldesignsystem.nl/handboek/huisstijl/themas/start-thema/#as-2-toepassing */
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
    'bg-default': 4.5,
  },
  'color-document': {
    'bg-subtle': 4.5,
  },
  'color-hover': {
    'bg-hover': 4.5,
  },
} as const;
const SKIP_CONTRAST_EXTENSION = new Set(['disabled', 'disabled-inverse']);

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

export const resolveConfigRefs = (rootConfig: Theme) => {
  resolveRefs(rootConfig['basis'], rootConfig);
  return rootConfig;
};

type ContrastExtension = {
  color: ColorToken & {
    $extensions: {
      [EXTENSION_RESOLVED_FROM]: TokenReference;
    };
  };
  expectedRatio: number;
};

export const addContrastExtensions = (rootConfig: Record<string, unknown>) => {
  walkColors(rootConfig, (color, path) => {
    const lastPath = path.at(-1)! as ForegroundColorKey;

    // Check that we have listed this color to have a known contrast counterpart
    if (!FOREGROUND_COLOR_KEYS.includes(lastPath) || !(lastPath in CONTRAST) || !CONTRAST[lastPath]) return;

    // WARNING: we currently skip contrast checking for disabled colors because start-theme and ma-theme do not comply
    const parentPath = path.at(-2);
    if (parentPath !== undefined && SKIP_CONTRAST_EXTENSION.has(parentPath)) return;

    // Loop over the expected ratios:
    for (const [backgroundName, expectedRatio] of Object.entries(CONTRAST[lastPath])) {
      // Build the path to the background color relative to where we found the foreground
      // path.slice(1, -1) removes the first element (basis) and last element (the color name)
      const refPath = `${path.slice(1, -1).join('.')}.${backgroundName}`;

      // Look for background in the same location as foreground (basis at root)
      const lookupPath = `basis.${refPath}`;
      const background = dlv(rootConfig, lookupPath);
      if (!background) continue;

      const contrastWith = {
        color: {
          $extensions: {
            [EXTENSION_RESOLVED_FROM]: `{${lookupPath}}`,
          },
          $type: 'color',
          $value: background['$value'] as ColorToken['$value'],
        },
        expectedRatio,
      } satisfies ContrastExtension;

      // Make sure $extensions exists
      color.$extensions ??= {};
      color.$extensions = {
        ...color.$extensions,
        [EXTENSION_CONTRAST_WITH]: Array.isArray(color.$extensions[EXTENSION_CONTRAST_WITH])
          ? [...color.$extensions[EXTENSION_CONTRAST_WITH], contrastWith]
          : [contrastWith],
      };
    }
  });
  return rootConfig;
};

export const useRefAsValue = (root: Record<string, unknown>) => {
  walkObject(
    root,
    // Find token with `original` (Style Dictionary convention)
    (token): token is Record<string, unknown> & { original: { $value: string } } => {
      if (!isValueObject(token)) return false;
      if (!isValueObject(token['original'])) return false;
      if (!('$value' in token['original'])) return false;
      return isRef(token['original']['$value']);
    },
    // Place `original.$value` in `$value`
    (token) => (token['$value'] = token.original.$value),
  );
  return root;
};

export const ERROR_CODES = {
  INSUFFICIENT_CONTRAST: 'insufficient_contrast',
  INVALID_REF: 'invalid_ref',
} as const;

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
const _ThemeSchema = z.looseObject({
  basis: BasisTokensSchema.optional(),
  // $metadata: z.strictObject({
  //   tokensSetOrder: z.array(z.string()),
  // }),
  // $themes: [],
  brand: BrandsSchema.optional(),
  // 'components/*': {},
});

export const ThemeSchema = _ThemeSchema.transform(useRefAsValue);

export type Theme = z.infer<typeof _ThemeSchema>;

export type ThemeValidationIssue = z.core.$ZodIssue & {
  actual?: number;
  ERROR_CODE?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
  tokens?: string[];
};

const getActualValue = <TValue>(token: { $value: TValue; $extensions?: Record<string, unknown> }): TValue => {
  return (token.$extensions?.[EXTENSION_RESOLVED_AS] as TValue) ?? token.$value;
};

export const StrictThemeSchema = ThemeSchema.transform(addContrastExtensions)
  .transform(resolveConfigRefs)
  .superRefine((root, ctx) => {
    // Validation 1: Check that all token references are valid
    try {
      validateRefs(root, root);
    } catch (error) {
      // Later on we can throw customized ValidationErrors that also contain the `path` so we can add it to the issue
      ctx.addIssue({
        code: 'custom',
        ERROR_CODE: ERROR_CODES.INVALID_REF,
        // The next line is type-safe, but because of that we don't cover all branches
        /* v8 ignore next */
        message: error instanceof Error ? error.message : 'Invalid token reference',
      });
    }

    // Validation 2: Check that colors have sufficient contrast
    walkColors(root, (token, path) => {
      if (!Array.isArray(token.$extensions?.[EXTENSION_CONTRAST_WITH])) return;

      const comparisons = token.$extensions[EXTENSION_CONTRAST_WITH];
      const baseColor = getActualValue<ColorValue>(token);

      if (typeof baseColor === 'string') return;

      for (const { color: background, expectedRatio } of comparisons) {
        const compareColor = getActualValue<ColorValue>(background);

        // Skip if the background color is a string reference (not yet resolved)
        if (typeof compareColor === 'string') continue;

        const contrast = compareContrast(baseColor, compareColor);
        const tokenAPath = path.join('.');
        const tokenBPathRaw = background.$extensions?.[EXTENSION_RESOLVED_FROM] as string | undefined;
        const tokenBPath = tokenBPathRaw?.replaceAll(/(^\{)|(\}$)/g, '');

        if (contrast < expectedRatio) {
          ctx.addIssue({
            actual: contrast,
            code: 'too_small',
            ERROR_CODE: ERROR_CODES.INSUFFICIENT_CONTRAST,
            message: 'Insufficient contrast',
            minimum: expectedRatio,
            origin: 'number',
            path: [...path, '$value'],
            tokens: [tokenAPath, tokenBPath].filter(Boolean),
          });

          ctx.addIssue({
            actual: contrast,
            code: 'too_small',
            ERROR_CODE: ERROR_CODES.INSUFFICIENT_CONTRAST,
            message: 'Insufficient contrast',
            minimum: expectedRatio,
            origin: 'number',
            path: [...(tokenBPath?.split('.') || []), '$value'],
            tokens: [tokenBPath, tokenAPath].filter(Boolean),
          });
        }
      }
    });
  });
