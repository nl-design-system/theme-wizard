import {
  StrictThemeSchema,
  type Theme as ThemeType,
  type BaseDesignToken,
  EXTENSION_RESOLVED_AS,
  stringifyToken,
  EXTENSION_RESOLVED_FROM,
  getTokenSubtype,
  walkTokens,
  SKIP,
  setExtension,
  EXTENSION_CONTRAST_WITH,
  addComponentContrastExtensions,
  addBasisContrastExtensions,
  upgradeLegacyTokens,
  addTokenSubTypeExtensions,
  resolveConfigRefs,
  useOriginalValue,
  removeExtensions,
  EXTENSION_REFERENCED_AT,
  EXTENSION_REFERENCE_COUNT,
  addTokenCountExtensions,
  addTokenPathExtensions,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { dequal } from 'dequal';
import dlv from 'dlv';
import { dset } from 'dset';
import ValidationIssue, { GroupedIssues } from '../ValidationIssue';
import { flattenTokens, refToCssVariable } from './lib';
import { createStylesheet, setToken, unsetToken } from './token-stylesheet';

const DEFAULT_SELECTOR = ':host';

type DesignTokens = Record<string, unknown>;
type DesignToken = {
  $type?: string;
  $value?: unknown;
  [key: string]: unknown;
};
export default class Theme {
  name = 'wizard';
  selector: string = DEFAULT_SELECTOR;
  readonly #defaults: Record<string, unknown>; // Every Theme has private defaults to revert to.
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
  static flatten(tokens: DesignTokens): Record<string, BaseDesignToken> {
    return flattenTokens(tokens);
  }

  /**
   * @param tokens Default token set for the theme, defaults to start tokens. Resetting a theme will revert to these tokens.
   * @param stylesheet Stylesheet instance to carry over so that adopted stylesheets can be preserved across new Theme instances.
   */
  constructor(tokens?: DesignTokens, stylesheet?: CSSStyleSheet) {
    this.#defaults = structuredClone(tokens || (StrictThemeSchema.parse(startTokens) as DesignTokens));
    const [styleSheet, rule] = createStylesheet(stylesheet, DEFAULT_SELECTOR);
    this.#rule = rule;
    this.#stylesheet = styleSheet;
    this.#runThemeProcessors(this.#defaults);
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
    useOriginalValue(tokens);
    upgradeLegacyTokens(tokens);
    addTokenSubTypeExtensions(tokens);
    addComponentContrastExtensions(tokens);
    addBasisContrastExtensions(tokens);
    resolveConfigRefs(tokens);
    removeExtensions(tokens, { include: [EXTENSION_REFERENCED_AT, EXTENSION_REFERENCE_COUNT] });
    addTokenCountExtensions(tokens);
    addTokenPathExtensions(tokens);
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

  toLegacyTokens(): DesignTokens {
    const legacyTokens = structuredClone(this.tokens);

    walkTokens(legacyTokens, (token) => {
      // Compute the stringified value before renaming $type, since stringifyToken dispatches on the original type.
      if (typeof token.$value !== 'string' && typeof token.$value !== 'number') {
        token.$value = stringifyToken(token);
      }

      const subtype = getTokenSubtype(token);
      if (subtype === 'font-size') {
        token.$type = 'fontSize';
      } else if (subtype === 'font-weight') {
        token.$type = 'fontWeight';
      } else if (subtype === 'line-height') {
        token.$type = 'lineHeight';
      }

      return SKIP;
    });

    return legacyTokens;
  }

  async toCSS() {
    walkTokens(this.tokens, (token, path) => {
      const stringified =
        typeof token.$value === 'string' || typeof token.$value === 'number' ? token.$value : stringifyToken(token);

      if (stringified === 'undefined') {
        unsetToken(this.#rule, path);
      } else if (typeof stringified === 'string' || typeof stringified === 'number') {
        // Only set tokens that we've confirmed to be strings or numbers. CSS will ignore
        // it otherwise and this should not happen anyway, so this is a fail-safe.
        setToken(this.#rule, path, refToCssVariable(stringified.toString()));
      }
      // Prevent walking deeper into the token's extensions
      return SKIP;
    });

    return this.stylesheet.cssRules[0].cssText;
  }

  get css() {
    return this.stylesheet.cssRules[0].cssText;
  }
}
