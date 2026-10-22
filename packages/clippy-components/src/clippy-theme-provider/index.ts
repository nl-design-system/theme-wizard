import type { TokenGroup } from '@nl-design-system-community/design-tokens-schema';
import { safeCustomElement } from '@lib/decorators';
import { LitElement, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { createThemeStylesheet } from './theme-stylesheet';

const tag = 'clippy-theme-provider';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyThemeProvider;
  }
}

@safeCustomElement(tag)
export class ClippyThemeProvider extends LitElement {
  @property({ attribute: false })
  theme: TokenGroup | undefined;

  // Per instance: unlike clippy-reset-theme's stylesheet, this one's content depends on `theme`.
  readonly #styleSheet = new CSSStyleSheet();

  override connectedCallback(): void {
    super.connectedCallback();
    this.#applyTheme();
    this.shadowRoot?.adoptedStyleSheets.push(this.#styleSheet);
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('theme')) {
      this.#applyTheme();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.shadowRoot?.adoptedStyleSheets.splice(0, this.shadowRoot?.adoptedStyleSheets.length);
  }

  #applyTheme(): void {
    const tokenRule = this.theme ? createThemeStylesheet(this.theme) : ':host {}';
    this.#styleSheet.replaceSync(`:host(:not([hidden])) { display: block; }\n${tokenRule}`);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

export * from './theme-stylesheet';
