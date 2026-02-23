import {
  stringifyColor,
  StrictThemeSchema,
  type Theme as ThemeType,
  EXTENSION_RESOLVED_AS,
  stringifyFontFamily,
  EXTENSION_RESOLVED_FROM,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { dequal } from 'dequal';
import dlv from 'dlv';
import { dset } from 'dset';
import StyleDictionary from 'style-dictionary';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
import ValidationIssue, { GroupedIssues } from '../ValidationIssue';
import { flattenTokens } from './lib';

export const PREVIEW_THEME_CLASS = 'preview-theme';

const STYLE_DICTIONARY_SETTINGS = {
  log: {
    errors: {
      brokenReferences: 'console', // don't throw broken reference errors, we should expect to handle that with schemas
    },
    verbosity: 'silent', // ignore logging since it goes to browser console
  },
} as const;

export default class Theme {
  static readonly defaults = StrictThemeSchema.parse(startTokens); // Start tokens are default for all Themes
  name = 'wizard';
  readonly #defaults: DesignTokens; // Every Theme has private defaults to revert to.
  #modified: boolean = false;
  #tokens: DesignTokens = {}; // In practice this will be set via the this.tokens() setter in the constructor
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
    this.#defaults = structuredClone(tokens || (Theme.defaults as DesignTokens));
    this.#stylesheet = stylesheet || new CSSStyleSheet();
    this.tokens = structuredClone(this.#defaults);
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
    this.toCSS({ selector: `.${PREVIEW_THEME_CLASS}, :host` }).then((css) => {
      const sheet = this.#stylesheet;
      sheet.replaceSync(css);
    });
  }

  // Updates a single token value at the given path, preserving other properties and extensions of the token.
  // Unlike the non-private instance method `updateAt`, this method does not mark the theme as modified.
  static #updateAt(tokens: DesignTokens, path: string, value: DesignToken['$value']) {
    const { $extensions, ...original } = dlv(tokens, path);
    // TODO: set extensions on the updated token based on the new value, for example if the new value is a reference to another token.
    delete $extensions?.[EXTENSION_RESOLVED_AS]; // Clear resolvedAs since the value is changing, it may no longer be valid
    delete $extensions?.[EXTENSION_RESOLVED_FROM]; // Clear resolvedFrom since the value is changing, it may no longer be valid
    dset(tokens, path, {
      ...original,
      $extensions,
      $value: value,
    });
  }

  updateAt(path: string, value: DesignToken['$value']) {
    this.#modified = !dequal(dlv(this.#defaults, `${path}.$value`), value);
    const tokens = structuredClone(this.tokens);
    Theme.#updateAt(tokens, path, value);

    this.tokens = tokens;
  }

  updateMany(values: { path: string; value: DesignToken['$value'] }[]) {
    const tokens = structuredClone(this.#tokens);
    this.#modified = true;
    for (const { path, value } of values) {
      Theme.#updateAt(tokens, path, value);
    }
    this.tokens = tokens;
  }

  // resetAt(path: string) {
  //   // TODO: implement
  // }

  at(path: string): DesignToken {
    return dlv(this.tokens, path);
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

        if (obj.$type === 'color' && obj.$value?.components) {
          return {
            ...obj,
            $value: stringifyColor(obj.$value),
          };
        }

        if (obj.$type === 'fontFamily' && Array.isArray(obj.$value)) {
          return {
            ...obj,
            $value: stringifyFontFamily(obj.$value),
          };
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

  async toCSS({
    resolved = false,
    selector = `.${this.name}-theme`,
  }: {
    resolved?: boolean;
    selector?: `.${string}`;
  } = {}) {
    const platform = 'css';
    // TODO: drop conversion to legacy tokens when Style Dictionary handles Spec Color definitions.
    const tokens = this.toLegacyTokens();
    const sd = new StyleDictionary({
      ...STYLE_DICTIONARY_SETTINGS,
      platforms: {
        [platform]: {
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables',
              options: {
                outputReferences: !resolved,
                selector,
              },
            },
          ],
          transformGroup: 'css',
        },
      },
      tokens,
    });
    const outputs = await sd.formatPlatform(platform);
    return outputs.reduce((acc, { output }) => `${acc}\n${output}`, '');
  }

  async toTokensJSON({ format = 'legacy' }: { format?: 'legacy' } = {}) {
    const platform = 'json';
    const tokens = format === 'legacy' ? this.toLegacyTokens() : this.tokens;
    const sd = new StyleDictionary({
      ...STYLE_DICTIONARY_SETTINGS,
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
