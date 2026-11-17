import { html, type TemplateResult } from 'lit';

// Fallback tokens for a component, e.g. `{ className: 'ams-theme', css: amsTokensCss }`
export type StoryBaseTheme = {
  className: string;
  css: string;
};

export const getStoryBaseTheme = (componentMeta: unknown): StoryBaseTheme | undefined =>
  (componentMeta as { parameters?: { baseTheme?: StoryBaseTheme } } | undefined)?.parameters?.baseTheme;

// Parsed once per CSS string and shared by every story preview, e.g. Amsterdam's ~96KB token CSS
const sharedStyleSheets = new Map<string, CSSStyleSheet>();

const getSharedStyleSheet = (css: string) => {
  let styleSheet = sharedStyleSheets.get(css);
  if (!styleSheet) {
    styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(css);
    sharedStyleSheets.set(css, styleSheet);
  }
  return styleSheet;
};

// Keeps a shadow root's adopted base theme stylesheet in sync with the current base theme
export class StoryBaseThemeStyles {
  #adoptedStyleSheet: CSSStyleSheet | undefined;

  adopt(shadowRoot: ShadowRoot | null, baseTheme: StoryBaseTheme | undefined) {
    const styleSheet = baseTheme ? getSharedStyleSheet(baseTheme.css) : undefined;
    if (!shadowRoot || styleSheet === this.#adoptedStyleSheet) {
      return;
    }
    shadowRoot.adoptedStyleSheets = [
      ...shadowRoot.adoptedStyleSheets.filter((adopted) => adopted !== this.#adoptedStyleSheet),
      ...(styleSheet ? [styleSheet] : []),
    ];
    this.#adoptedStyleSheet = styleSheet;
  }
}

// Must wrap the theme providers, so their tokens take precedence over the base theme
export const renderWithStoryBaseTheme = (baseTheme: StoryBaseTheme | undefined, content: TemplateResult) =>
  baseTheme ? html`<div class=${baseTheme.className}>${content}</div>` : content;
