import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import { jsonAttribute } from '@lib/converters';
import { safeCustomElement } from '@lib/decorators';
import { LitElement, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { createThemeStylesheet } from './theme-stylesheet';

const tag = 'clippy-theme-provider';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyThemeProvider;
  }
}

@safeCustomElement(tag)
export class ClippyThemeProvider extends LitElement {
  static override readonly styles = [styles];

  // `.theme=${obj}` (property binding) bypasses the converter entirely;
  // `theme='{"..."}'` (attribute) is parsed as JSON for consumers outside a templating library.
  @property({ converter: jsonAttribute<TokenGroup>() })
  theme: TokenGroup | undefined;

  // Per instance: unlike clippy-reset-theme's stylesheet, this one's content depends on `theme`.
  readonly #styleSheet = new CSSStyleSheet();

  override connectedCallback(): void {
    super.connectedCallback();
    this.#applyTheme();
    this.shadowRoot?.adoptedStyleSheets.push(this.#styleSheet);
    console.log('this.shadowRoot?.adoptedStyleSheets', this.shadowRoot?.adoptedStyleSheets);
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('theme')) {
      this.#applyTheme();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Only remove our own sheet - `static styles` owns the rest of `adoptedStyleSheets`.
    const sheets = this.shadowRoot?.adoptedStyleSheets;
    const index = sheets?.indexOf(this.#styleSheet) ?? -1;
    if (index !== -1) {
      sheets?.splice(index, 1);
    }
  }

  #applyTheme(): void {
    console.log('this.theme', this.theme);
    this.#styleSheet.replaceSync(createThemeStylesheet(this.theme ?? Object.create(null)));
    console.log('this.#styleSheet', this.#styleSheet);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

export * from './theme-stylesheet';
