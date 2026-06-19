import {
  StrictThemeSchema,
  type Theme as ThemeType,
  type BaseDesignToken,
  EXTENSION_RESOLVED_AS,
  stringifyColor,
  stringifyFontFamily,
  stringifyDimension,
  EXTENSION_RESOLVED_FROM,
  EXTENSION_TOKEN_SUBTYPE,
  walkTokens,
  SKIP,
  setExtension,
  EXTENSION_CONTRAST_WITH,
  addComponentContrastExtensions,
  addBasisContrastExtensions,
  upgradeLegacyTokens,
  resolveConfigRefs,
  useRefAsValue,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { dequal } from 'dequal';
import dlv from 'dlv';
import { dset } from 'dset';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
import ValidationIssue, { GroupedIssues } from '../ValidationIssue';
import { flattenTokens, refToCssVariable } from './lib';
import { createStylesheet, setToken, unsetToken } from './token-stylesheet';

export const PREVIEW_THEME_CLASS = 'preview-theme';
const DEFAULT_SELECTOR = `.${PREVIEW_THEME_CLASS}, :host`;

export default class Theme {
  name = 'wizard';
  selector: string = DEFAULT_SELECTOR;
  readonly #defaults: DesignTokens; // Every Theme has private defaults to revert to.
  #modified: boolean = false;
  #tokens: DesignTokens = {}; // In practice this will be set via the this.tokens() setter in the constructor
  readonly #rule: CSSRule;
  readonly #stylesheet: CSSStyleSheet;
  #validationIssues: ValidationIssue[] = [];

  /**
   * Flatten a nested DesignTokens object into a flat map of token paths to DesignToken objects.
   * @param tokens
   * @returns
   */
  static flatten(tokens: DesignTokens): Record<string, DesignToken> {
    return flattenTokens(tokens);
  }

  /**
   * @param tokens Default token set for the theme, defaults to start tokens. Resetting a theme will revert to these tokens.
   * @param stylesheet Stylesheet instance to carry over so that adopted stylesheets can be preserved across new Theme instances.
   */
  constructor(tokens?: DesignTokens, stylesheet?: CSSStyleSheet) {
    // @TODO: make sure that parsed tokens conform to DesignTokens type;
    this.#defaults = structuredClone(tokens || (StrictThemeSchema.parse(startTokens) as DesignTokens));
    const [styleSheet, rule] = createStylesheet(stylesheet, DEFAULT_SELECTOR);
    this.#rule = rule;
    this.#stylesheet = styleSheet;
    this.tokens = structuredClone(this.#defaults);
  }

  /**
   * Creates a new Theme instance with the same state, without re-running validation or CSS generation.
   * Use this instead of `new Theme()` when you need a new reference for Lit context change detection.
   */
  clone(stylesheet = this.#stylesheet): Theme {
    const cloned = new Theme(this.#defaults, stylesheet);
    cloned.#tokens = this.#tokens;
    cloned.#modified = this.#modified;
    cloned.#validationIssues = [...this.#validationIssues];
    cloned.toCSS();
    return cloned;
  }

  get defaults() {
    return this.#defaults;
  }

  get modified() {
    return this.#modified;
  }

  get stylesheet() {
    return this.#stylesheet;
  }

  get tokens() {
    return this.#tokens;
  }

  set tokens(values: DesignTokens) {
    this.#modified = !dequal(this.#defaults, values);
    this.#validateTheme(values);
    this.#tokens = values;
    this.toCSS();
  }

  // Updates a single token value at the given path, preserving other properties and extensions of the token.
  // Unlike the non-private instance method `updateAt`, this method does not mark the theme as modified.
  static #updateAt(tokens: DesignTokens, path: string, value: DesignToken['$value']) {
    const { $extensions, ...original } = dlv(tokens, path);
    delete $extensions?.[EXTENSION_RESOLVED_AS]; // Clear resolvedAs since the value is changing, it may no longer be valid
    delete $extensions?.[EXTENSION_RESOLVED_FROM]; // Clear resolvedFrom since the value is changing, it may no longer be valid
    delete $extensions?.[EXTENSION_CONTRAST_WITH]; // The value might change a ref, so need to re-caculate the extension
    dset(tokens, path, {
      ...original,
      $extensions,
      $value: value,
    });
  }

  #runThemeProcessors(tokens: DesignTokens) {
    useRefAsValue(tokens);
    upgradeLegacyTokens(tokens);
    addComponentContrastExtensions(tokens);
    addBasisContrastExtensions(tokens);
    resolveConfigRefs(tokens);
    return tokens;
  }

  updateAt(path: string, value: DesignToken['$value']) {
    this.#modified = !dequal(dlv(this.#defaults, `${path}.$value`), value);
    const tokens = structuredClone(this.tokens);
    Theme.#updateAt(tokens, path, value);
    this.#runThemeProcessors(tokens);
    this.tokens = tokens;
  }

  updateMany(values: { path: string; value: DesignToken['$value'] }[]) {
    const tokens = structuredClone(this.#tokens);
    this.#modified = true;
    for (const { path, value } of values) {
      Theme.#updateAt(tokens, path, value);
    }
    this.#runThemeProcessors(tokens);
    this.tokens = tokens;
  }

  setGroupExtension(groupPath: string, extensionKey: string, value: unknown): void {
    const group = dlv(this.#tokens, groupPath);
    if (group && typeof group === 'object') {
      setExtension(group as BaseDesignToken, extensionKey, value);
    }
  }

  resetAt(path: string) {
    const defaultValue = dlv(this.#defaults, path);
    this.updateAt(path, defaultValue?.$value);
  }

  resetMany(paths: string[]) {
    const updates = paths
      .map((path) => ({ path, value: dlv(this.#defaults, path)?.$value }))
      .filter(({ value }) => value !== undefined);

    if (updates.length > 0) {
      this.updateMany(updates);
    }
  }

  at(path: string): DesignToken {
    return dlv(this.tokens, path);
  }

  issuesAt(path: string): ValidationIssue[] {
    return this.#validationIssues.filter((issue) => issue.path.startsWith(path));
  }

  get errorCount(): number {
    return this.#validationIssues.length;
  }

  get groupedIssues(): GroupedIssues {
    return Object.groupBy(this.issues, ({ code }) => code);
  }

  get issues(): ValidationIssue[] {
    return this.#validationIssues;
  }

  #validateTheme(theme: DesignTokens): ValidationIssue[] {
    const result = StrictThemeSchema.safeParse(theme as ThemeType);

    if (result.success) {
      this.#validationIssues = [];
      return [];
    }

    const issues = (result.error.issues || []).map((issue) => new ValidationIssue(issue));
    this.#validationIssues = issues;
    return issues;
  }

  reset() {
    this.tokens = structuredClone(this.#defaults);
    this.#modified = false;
  }

  toLegacyTokens() {
    // TODO: replace with a design-tokens-schema transform to make sure all token types have a legacy format
    const clonedTokens = structuredClone(this.tokens);

    function convertTokens(obj: DesignToken): DesignToken {
      if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
          return obj?.map(convertTokens);
        }

        if (obj.$type === 'color' && typeof obj.$value !== 'string') {
          return {
            ...obj,
            $value: stringifyColor(obj.$value),
          };
        } else if (obj.$type === 'fontFamily' && typeof obj.$value !== 'string') {
          return {
            ...obj,
            $value: stringifyFontFamily(obj.$value),
          };
        } else if (obj.$type === 'dimension' && typeof obj.$value === 'object' && obj.$value?.unit) {
          const subtype = obj['$extensions']?.[EXTENSION_TOKEN_SUBTYPE];
          const value = stringifyDimension(obj.$value);

          if (subtype === 'font-size') {
            return {
              ...obj,
              $type: 'fontSize',
              $value: value,
            };
          } else if (subtype === 'line-height') {
            return {
              ...obj,
              $type: 'lineHeight',
              $value: value,
            };
          }

          // For other dimension tokens, keep as-is
          return {
            ...obj,
            $value: value,
          };
        } else if (obj.$type === 'number') {
          const subtype = obj['$extensions']?.[EXTENSION_TOKEN_SUBTYPE];

          if (subtype === 'font-weight') {
            return {
              ...obj,
              $type: 'fontWeight',
            };
          } else if (subtype === 'line-height') {
            return {
              ...obj,
              $type: 'lineHeight',
            };
          }

          return obj;
        }

        const result: Record<string, DesignToken> = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = convertTokens(value);
        }
        return result;
      }

      return obj;
    }

    return convertTokens(clonedTokens);
  }

  async toCSS() {
    const tokens = this.toLegacyTokens();

    walkTokens(tokens, (token, path) => {
      if (token.$value === 'undefined') {
        unsetToken(this.#rule, path);
      } else if (typeof token.$value === 'string' || typeof token.$value === 'number') {
        // Only set tokens that we've confirmed to be strings or numbers. CSS will ignore
        // it otherwise and this should not happen anyway, so this is a fail-safe.
        setToken(this.#rule, path, refToCssVariable(token.$value.toString()));
      }
      // Prevent walking deeper into the token's extensions
      return SKIP;
    });

    return this.stylesheet.cssRules[0].cssText;
  }

  get css() {
    return this.stylesheet.cssRules[0].cssText;
  }

  async toTokensJSON({ format = 'legacy' }: { format?: 'legacy' } = {}) {
    const StyleDictionary = await import('style-dictionary');
    const platform = 'json';
    const tokens = format === 'legacy' ? this.toLegacyTokens() : this.tokens;
    const sd = new StyleDictionary.default({
      log: {
        errors: {
          brokenReferences: 'console', // don't throw broken reference errors, we should expect to handle that with schemas
        },
        verbosity: 'silent', // ignore logging since it goes to browser console
      },
      platforms: {
        [platform]: {
          files: [
            {
              destination: 'tokens.json',
              format: 'json',
            },
          ],
        },
      },
      tokens,
    });
    const outputs = await sd.formatPlatform(platform);
    return outputs.reduce((acc, { output }) => `${acc}\n${output}`, '');
  }
}
