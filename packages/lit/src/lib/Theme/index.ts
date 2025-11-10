import { stringifyColor, ThemeSchema } from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import StyleDictionary from 'style-dictionary';
import { DesignToken, DesignTokens } from 'style-dictionary/types';

export default class Theme {
  static readonly defaults = ThemeSchema.parse(startTokens); // Start tokens are default for all Themes
  #defaults: DesignTokens; // Every Theme has private defaults to revert to.
  #tokens: DesignTokens = {}; // In practice this will be set via the this.tokens() setter in the constructor
  #stylesheet: CSSStyleSheet = new CSSStyleSheet();

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
    this.toCSS().then((css) => {
      const sheet = this.#stylesheet;
      sheet.replace(css);
    });
  }

  get stylesheet() {
    return this.#stylesheet;
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
            $value: stringifyColor(obj.$value)
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

  async toCSS({ resolved = false }: { resolved?: boolean } = {}) {
    // TODO: drop conversion to legacy tokens when Style Dictionary handles Spec Color definitions.
    const tokens = await this.toLegacyTokens()

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
