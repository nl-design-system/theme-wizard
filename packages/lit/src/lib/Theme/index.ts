import {
  stringifyColor,
  ThemeSchema,
  StrictThemeSchema,
  type Theme as ThemeType,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import dlv from 'dlv';
import { dset } from 'dset';
import StyleDictionary from 'style-dictionary';
import { DesignToken, DesignTokens } from 'style-dictionary/types';
import ValidationIssue from '../ValidationIssue';

export const PREVIEW_THEME_CLASS = 'preview-theme';

export default class Theme {
  static readonly defaults = ThemeSchema.parse(startTokens); // Start tokens are default for all Themes
  #defaults: DesignTokens; // Every Theme has private defaults to revert to.
  #tokens: DesignTokens = {}; // In practice this will be set via the this.tokens() setter in the constructor
  #stylesheet: CSSStyleSheet = new CSSStyleSheet();
  name = 'wizard';
  #validationIssues: ValidationIssue[] = [];

  constructor(tokens?: DesignTokens) {
    // @TODO: make sure that parsed tokens conform to DesignTokens type;
    this.#defaults = structuredClone(tokens || (Theme.defaults as DesignTokens));
    this.tokens = structuredClone(this.#defaults);
  }

  get defaults() {
    return this.#defaults;
  }

  get tokens() {
    return this.#tokens;
  }

  set tokens(values: DesignTokens) {
    this.#tokens = values;
    // Automatically validate when tokens are updated
    this.#validateTheme(values);
    this.toCSS({ selector: `.${PREVIEW_THEME_CLASS}` }).then((css) => {
      const sheet = this.#stylesheet;
      sheet.replace(css);
    });
  }

  get stylesheet() {
    return this.#stylesheet;
  }

  updateAt(path: string, value: DesignToken['$value']) {
    const tokens = this.tokens;
    dset(tokens, `${path}.$value`, value);
    this.tokens = tokens;
  }

  at(path: string): DesignToken {
    return dlv(this.tokens, path);
  }

  get errorCount(): number {
    return this.#validationIssues.length;
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
  }

  async toLegacyTokens() {
    // TODO: replace with a design-tokens-schema transform to make sure all token types have a legacy format
    const clonedTokens = structuredClone(this.tokens);

    function convertColorTokens(obj: DesignToken): DesignToken {
      if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
          return obj?.map(convertColorTokens);
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
            $value: obj.$value.join(', '),
          };
        }

        const result: Record<string, DesignToken> = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = convertColorTokens(value);
        }
        return result;
      }

      return obj;
    }

    return convertColorTokens(clonedTokens);
  }

  async toCSS({
    resolved = false,
    selector = `.${this.name}-theme`,
  }: {
    resolved?: boolean;
    selector?: `.${string}`;
  } = {}) {
    // TODO: drop conversion to legacy tokens when Style Dictionary handles Spec Color definitions.
    const tokens = await this.toLegacyTokens();

    const sd = new StyleDictionary({
      log: {
        errors: {
          brokenReferences: 'console', // don't throw broken reference errors, we should expect to handle that with schemas
        },
        verbosity: 'silent', // ignore logging since it goes to browser console
      },
      platforms: {
        css: {
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
    const outputs = await sd.formatPlatform('css');
    return outputs.reduce((acc, { output }) => `${acc}\n${output}`, '');
  }
}
