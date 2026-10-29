import { html, type TemplateResult } from 'lit';

// Fallback tokens for a component, e.g. `{ className: 'ams-theme', css: amsTokensCss }`
export type StoryBaseTheme = {
  className: string;
  css: string;
};

export const getStoryBaseTheme = (componentMeta: unknown): StoryBaseTheme | undefined =>
  (componentMeta as { parameters?: { baseTheme?: StoryBaseTheme } } | undefined)?.parameters?.baseTheme;

// Adopts a base theme's CSS into a shadow root, re-parsing only when the CSS changes
export class StoryBaseThemeStyles {
  readonly #styleSheet = new CSSStyleSheet();
  #css: string | undefined;

  adopt(shadowRoot: ShadowRoot | null, baseTheme: StoryBaseTheme | undefined) {
    if (!shadowRoot) {
      return;
    }
    if (baseTheme?.css !== this.#css) {
      this.#css = baseTheme?.css;
      this.#styleSheet.replaceSync(this.#css ?? '');
    }
    if (!shadowRoot.adoptedStyleSheets.includes(this.#styleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, this.#styleSheet];
    }
  }
}

// Must wrap the theme providers, so their tokens take precedence over the base theme
export const renderWithStoryBaseTheme = (baseTheme: StoryBaseTheme | undefined, content: TemplateResult) =>
  baseTheme ? html`<div class=${baseTheme.className}>${content}</div>` : content;
