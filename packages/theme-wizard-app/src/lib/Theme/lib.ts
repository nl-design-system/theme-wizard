import {
  BaseDesignTokenIdentifier,
  isTokenLike,
  type TokenPath,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
import { TokenGroup } from '../../components/wizard-reset-theme/reset-css';

export const tokenPathToCSSCustomProperty = (tokenPath: BaseDesignTokenIdentifier[]): string =>
  '--' + tokenPath.join('-');

export const styleObjectToString = (styleObject: Record<string, string>) =>
  Object.entries(styleObject)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');

export const flattenTokens = (
  tokens: DesignTokens,
  basePath: string = '',
  accumulator: Record<string, DesignToken> = {},
): Record<string, DesignToken> => {
  for (const [key, token] of Object.entries(tokens)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isTokenLike(token)) {
      accumulator[path] = token;
    } else if (token && typeof token === 'object' && !Array.isArray(token)) {
      flattenTokens(token as DesignTokens, path, accumulator);
    }
  }

  return accumulator;
};

/**
 * Replace `{example.component.property}` with `var(--example-component-property)`
 */
export const refToCssVariable = (value: string): string =>
  value.replaceAll(/\{([^}]+)\}/g, (_, tokenName) => {
    return `var(--${tokenName.replaceAll('.', '-')})`;
  });

/**
 * Flattens preset token values into `{ path, value }` updates.
 * Unlike `walkTokens`, this also handles tokens that only specify `$value` without `$type`.
 */
export const presetTokensToUpdateMany = (
  tokens: unknown,
  basePath = '',
): { path: string; value: DesignToken['$value'] }[] => {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) return [];

  const obj = tokens as Record<string, unknown>;

  if (Object.hasOwn(obj, '$value')) {
    const result = { path: basePath, value: obj['$value'] as DesignToken['$value'] };
    return [result];
  }

  return Object.entries(obj).flatMap(([key, value]) =>
    presetTokensToUpdateMany(value, basePath ? `${basePath}.${key}` : key),
  );
};

/**
 * Converts regular token objects to a style object of CSS custom properties.
 *
 * Use this for full token trees that are compatible with `walkTokens(...)`.
 * Example: design-token objects loaded from theme files or component token definitions.
 *
 * Example:
 * `{ nl: { button: { color: { $value: '{basis.color.default.color-default}' } } } }`
 * becomes `{ '--nl-button-color': 'var(--basis-color-default-color-default)' }`.
 *
 * Do not use this for lightweight preset payloads that only contain ad-hoc `$value` leaves.
 * For those objects, use `presetTokensToStyle(...)`.
 */
export const tokensToStyle = (tokens: TokenGroup) => {
  const style: { [index: string]: string } = {};

  walkTokens(tokens, (token, path) => {
    if (typeof token.$value === 'string') {
      const cssProperty = tokenPathToCSSCustomProperty(path);
      const cssValue = refToCssVariable(token.$value);
      style[cssProperty] = cssValue;
    }
  });

  return style;
};

/**
 * Converts lightweight preset token objects to CSS custom properties.
 *
 * Use this for runtime preset payloads that only contain nested objects with `$value` leaves,
 * and that are not guaranteed to be compatible with `walkTokens(...)`.
 * Example: resolved Story Wizard preset tokens such as
 * `{ nl: { paragraph: { lead: { 'font-size': { $value: '{basis.text.font-size.xl}' } } } } }`.
 *
 * Example:
 * `{ nl: { paragraph: { 'font-size': { $value: '{basis.text.font-size.md}' } } } }`
 * becomes `{ '--nl-paragraph-font-size': 'var(--basis-text-font-size-md)' }`.
 *
 * This is the lightweight variant. Keep using `tokensToStyle(...)` for regular token trees.
 */
export const presetTokensToStyle = (
  tokens: unknown,
  path: TokenPath = [],
  style: Record<string, string> = {},
): Record<string, string> => {
  if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
    return style;
  }

  const obj = tokens as Record<string, unknown>;

  if (Object.hasOwn(obj, '$value')) {
    const value = obj['$value'];

    if (typeof value === 'string') {
      style[tokenPathToCSSCustomProperty(path)] = refToCssVariable(value);
    }

    return style;
  }

  Object.entries(obj).forEach(([key, value]) => {
    presetTokensToStyle(value, [...path, key], style);
  });

  return style;
};

/**
 * Pseudo-flow for a future "build a full theme from selected presets" implementation.
 *
 * Idea in simple terms:
 * 1. Collect all selected preset payloads from the wizard.
 * 2. Merge those small payloads into one combined token object.
 * 3. Normalize that combined object into a full schema-aware theme tree.
 * 4. Run regular theme tooling on the normalized result.
 *
 * Pseudo-code:
 * ```ts
 * function buildThemeFromSelectedPresets(selectedPresets) {
 *   const presetPayloads = selectedPresets.map((preset) => preset.tokens);
 *   const mergedPresetTokens = mergePresetPayloads(presetPayloads);
 *   const normalizedThemeTokens = normalizePresetTokensToThemeTree(mergedPresetTokens);
 *
 *   return normalizedThemeTokens;
 * }
 * ```
 */
