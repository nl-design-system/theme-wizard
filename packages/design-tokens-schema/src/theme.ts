import buttonTokens from '@nl-design-system-candidate/button-tokens';
import codeBlockTokens from '@nl-design-system-candidate/code-block-tokens';
import codeTokens from '@nl-design-system-candidate/code-tokens';
import colorSampleTokens from '@nl-design-system-candidate/color-sample-tokens';
import dataBadgeTokens from '@nl-design-system-candidate/data-badge-tokens';
import headingTokens from '@nl-design-system-candidate/heading-tokens';
import linkTokens from '@nl-design-system-candidate/link-tokens';
import markTokens from '@nl-design-system-candidate/mark-tokens';
import numberBadgeTokens from '@nl-design-system-candidate/number-badge-tokens';
import paragraphTokens from '@nl-design-system-candidate/paragraph-tokens';
import skipLinkTokens from '@nl-design-system-candidate/skip-link-tokens';
import dlv from 'dlv';
import * as z from 'zod';
import {
  type ForegroundColorKey,
  type BorderColorKey,
  CONTRAST,
  SKIP_CONTRAST_EXTENSION,
  BrandsSchema,
  BasisTokensSchema,
  isForegroundColor,
  isBorderColor,
  COLOR_KEYS,
} from './basis-tokens';
import { setExtension } from './extensions';
import { removeNonTokenProperties } from './remove-non-token-properties';
import { validateRefs, resolveRefs, EXTENSION_RESOLVED_FROM, EXTENSION_RESOLVED_AS } from './resolve-refs';
import { ColorValue, compareContrast, type ColorToken } from './tokens/color-token';
import { TokenReference, isRef, isValueObject } from './tokens/token-reference';
import { EXTENSION_TOKEN_SUBTYPE, upgradeLegacyTokens } from './upgrade-legacy-tokens';
import {
  ERROR_CODES,
  type InvalidRefIssue,
  LineHeightUnitIssue,
  MinFontSizeIssue,
  createContrastIssue,
  createMinLineHeightIssue,
} from './validation-issue';
import { validateFontSize, MIN_FONT_SIZE_PX, MIN_FONT_SIZE_REM, validateMinLineHeight, remToPx } from './validations';
import { walkColors, walkDimensions, walkLineHeights, walkObject } from './walker';

export const EXTENSION_CONTRAST_WITH = 'nl.nldesignsystem.contrast-with';
export const EXTENSION_COLOR_SCALE_POSITION = 'nl.nldesignsystem.color-scale-position';

export const resolveConfigRefs = (rootConfig: Theme) => {
  resolveRefs(rootConfig['basis'], rootConfig);
  return rootConfig;
};

const KNOWN_LINE_HEIGHT_FONT_SIZE_COMBOS = new Map<string, string>([
  ['basis.text.font-size.sm', 'basis.text.line-height.sm'],
  ['basis.text.font-size.md', 'basis.text.line-height.md'],
  ['basis.text.font-size.lg', 'basis.text.line-height.lg'],
  ['basis.text.font-size.xl', 'basis.text.line-height.xl'],
  ['basis.text.font-size.2xl', 'basis.text.line-height.2xl'],
  ['basis.text.font-size.3xl', 'basis.text.line-height.3xl'],
  ['basis.text.font-size.4xl', 'basis.text.line-height.4xl'],
]);

export const addComponentFontSizeLineHeightPairs = (initialMap: Map<string, string>) => {
  const result = new Map(initialMap);
  const componentsTokens = [
    buttonTokens,
    codeBlockTokens,
    codeTokens,
    colorSampleTokens,
    dataBadgeTokens,
    headingTokens,
    linkTokens,
    markTokens,
    numberBadgeTokens,
    paragraphTokens,
    skipLinkTokens,
  ];
  for (const componentTokens of componentsTokens) {
    walkObject(
      componentTokens,
      (obj) => isValueObject(obj),
      (obj, path) => {
        if ('line-height' in obj && 'font-size' in obj) {
          const tokenPath = path.join('.');
          result.set(`${tokenPath}.font-size`, `${tokenPath}.line-height`);
        }
      },
    );
  }
  return result;
};

export const addColorScalePositionExtensions = (rootConfig: Record<string, unknown>) => {
  walkColors(rootConfig, (color, path) => {
    const lastPath = path.at(-1)!;

    // Find if the token name ends with any COLOR_KEYS value
    const matchingColorKeyIndex = COLOR_KEYS.findIndex((colorKey) => lastPath.endsWith(colorKey));

    // If no match found, skip this token
    if (matchingColorKeyIndex === -1) return;

    // Add the extension with the index
    setExtension(color, EXTENSION_COLOR_SCALE_POSITION, matchingColorKeyIndex + 1);
  });
  return rootConfig;
};

export type ContrastExtension = {
  color: ColorToken & {
    $extensions: {
      [EXTENSION_RESOLVED_FROM]: TokenReference;
    };
  };
  expectedRatio: number;
};

export const addContrastExtensions = (rootConfig: Record<string, unknown>) => {
  walkColors(rootConfig, (color, path) => {
    const lastPath = path.at(-1)! as ForegroundColorKey | BorderColorKey;

    // Check that we have listed this color to have a known contrast counterpart
    if ((!isForegroundColor(lastPath) && !isBorderColor(lastPath)) || !(lastPath in CONTRAST) || !CONTRAST[lastPath]) {
      return;
    }

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

      const existing = color['$extensions']?.[EXTENSION_CONTRAST_WITH];

      if (Array.isArray(existing)) {
        setExtension(color, EXTENSION_CONTRAST_WITH, [...existing, contrastWith]);
      } else {
        setExtension(color, EXTENSION_CONTRAST_WITH, [contrastWith]);
      }
    }
  });
  return rootConfig;
};

export const useRefAsValue = (root: Record<string, unknown>) => {
  walkObject(
    root,
    // Find token with `original` (Style Dictionary convention)
    (token): token is Record<string, unknown> & { original: { $value: TokenReference } } => {
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
const ThemeShapeSchema = z.looseObject({
  basis: BasisTokensSchema.optional(),
  brand: BrandsSchema.optional(),
});

/**
 * Preprocessing pipeline: applies all transformations before Zod validation.
 * This ensures data is normalized before schema validation.
 * Clones input to avoid mutating the original object.
 */
const preprocessTheme = (input: unknown): Record<string, unknown> => {
  let data = structuredClone(input as Record<string, unknown>);
  // Apply transformations in order
  data = useRefAsValue(data);
  return data;
};

/**
 * Strict preprocessing pipeline: includes all preprocessing for validation.
 * Clones input to avoid mutating the original object.
 */
const preprocessThemeStrict = (input: unknown): Record<string, unknown> => {
  let data = structuredClone(input as Record<string, unknown>);
  // Step 1: Get `$extensions['original']['$value'] fron Style Dictionary and place it in $value
  data = useRefAsValue(data);
  // Step 2: Clean up non-token properties for faster processing
  data = removeNonTokenProperties(data);
  // Step 3: Upgrade legacy token formats
  data = upgradeLegacyTokens(data);
  // Step 4: Add extensions
  data = addContrastExtensions(data);
  data = addColorScalePositionExtensions(data);
  // Step 5: Add $value of referenced token in $extensions['resolved-as']
  data = resolveConfigRefs(data);
  return data;
};

export const ThemeSchema = z.unknown().transform(preprocessTheme).pipe(ThemeShapeSchema);

export type Theme = z.infer<typeof ThemeShapeSchema>;

const getActualValue = <TValue>(token: { $value: TValue; $extensions?: Record<string, unknown> }): TValue => {
  return (token.$extensions?.[EXTENSION_RESOLVED_AS] as TValue) ?? token.$value;
};

export const StrictThemeSchema = z
  .unknown()
  .transform(preprocessThemeStrict)
  .pipe(ThemeShapeSchema)
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
      } satisfies InvalidRefIssue);
    }

    // Validation 2: Check that colors have sufficient contrast
    walkColors(root, (token, path) => {
      if (!Array.isArray(token.$extensions?.[EXTENSION_CONTRAST_WITH])) return;

      const comparisons = token.$extensions[EXTENSION_CONTRAST_WITH];
      const baseColor = getActualValue<ColorValue>(token);

      for (const { color: background, expectedRatio } of comparisons) {
        const compareColor = getActualValue<ColorValue>(background);

        const contrast = compareContrast(baseColor, compareColor);
        const tokenAPath = path.join('.');
        const tokenBPathRaw = background.$extensions?.[EXTENSION_RESOLVED_FROM] as string | undefined;
        const tokenBPath = tokenBPathRaw?.replaceAll(/(^\{)|(\}$)/g, '');

        if (contrast < expectedRatio) {
          ctx.addIssue(
            createContrastIssue({
              actual: contrast,
              minimum: expectedRatio,
              path: [...path, '$value'],
              tokens: tokenBPath ? [tokenAPath, tokenBPath] : [tokenAPath],
            }),
          );

          ctx.addIssue(
            createContrastIssue({
              actual: contrast,
              minimum: expectedRatio,
              path: [...(tokenBPath?.split('.') || []), '$value'],
              tokens: tokenBPath ? [tokenBPath, tokenAPath] : [tokenAPath],
            }),
          );
        }
      }
    });

    // Validation 3: font must have minimum size
    walkDimensions(root, (token, path) => {
      // Sub-type must be font-size
      if (token.$extensions?.[EXTENSION_TOKEN_SUBTYPE] !== 'font-size') return;
      // Do not attempt to process refs
      if (isRef(token.$value)) return;

      if (isValueObject(token.$value) && !validateFontSize(token.$value)) {
        const actual = `${token.$value.value}${token.$value.unit}`;
        ctx.addIssue({
          actual,
          code: 'custom',
          ERROR_CODE: ERROR_CODES.FONT_SIZE_TOO_SMALL,
          input: actual,
          message: `Font-size should be ${MIN_FONT_SIZE_PX}px or ${MIN_FONT_SIZE_REM}rem minimum (got: "${actual}")`,
          minimum: `${MIN_FONT_SIZE_PX}px / ${MIN_FONT_SIZE_REM}rem`,
          origin: 'number',
          path: [...path, '$value'],
        } satisfies MinFontSizeIssue);
      }
    });

    // Validation 4: check that line-heights are unit-less numbers
    walkLineHeights(root, (token, path) => {
      // Refs are OK
      if (isRef(token.$value)) return;

      if (typeof token.$value === 'number') {
        if (!validateMinLineHeight(token.$value)) {
          const issue = createMinLineHeightIssue({
            actual: token.$value,
            path: [...path, '$value'],
          });
          ctx.addIssue(issue);
        }
        return;
      }

      ctx.addIssue({
        code: 'invalid_type',
        ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
        expected: 'number',
        input: token.$value,
        message: `Line-height should be a unitless number (got: ${JSON.stringify(token.$value)})`,
        path: [...path, '$value'],
      } satisfies LineHeightUnitIssue);
    });

    // Validation 5: check that contextual line-heights are large enough
    const knownLineHeightFontSizePairs = addComponentFontSizeLineHeightPairs(KNOWN_LINE_HEIGHT_FONT_SIZE_COMBOS);
    for (const [fontSizePath, lineHeightPath] of knownLineHeightFontSizePairs) {
      const fontSizeToken = dlv(root, fontSizePath);
      const lineHeightToken = dlv(root, lineHeightPath);

      if (fontSizeToken?.$type === 'dimension' && lineHeightToken?.$type === 'dimension') {
        // Make sure we work with actual values, not references
        const fontSizeValue = isRef(fontSizeToken.$value)
          ? fontSizeToken.$extensions[EXTENSION_RESOLVED_AS]
          : fontSizeToken.$value;
        const lineHeightValue = isRef(lineHeightToken.$value)
          ? lineHeightToken.$extensions?.[EXTENSION_RESOLVED_AS]
          : lineHeightToken.$value;

        // Normalize dimensions to px units, even if declared in rem
        const normalizedFontSize = fontSizeValue.unit === 'rem' ? remToPx(fontSizeValue.value) : fontSizeValue.value;
        const normalizedLineHeight =
          lineHeightValue.unit === 'rem' ? remToPx(lineHeightValue.value) : lineHeightValue.value;

        const actualLineHeight = normalizedLineHeight / normalizedFontSize;

        if (!validateMinLineHeight(actualLineHeight)) {
          ctx.addIssue(
            createMinLineHeightIssue({
              actual: actualLineHeight,
              path: [...lineHeightPath.split('.'), '$value'],
            }),
          );
        }
      }
    }
  });
