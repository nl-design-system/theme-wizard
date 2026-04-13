import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import { createResetTheme } from './reset-theme';

const resetThemeStyleSheet = new CSSStyleSheet();
resetThemeStyleSheet.replaceSync(createResetTheme(':host'));

const tag = 'clippy-reset-theme';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyResetTheme;
  }
}

@safeCustomElement(tag)
export class ClippyResetTheme extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.shadowRoot?.adoptedStyleSheets.push(resetThemeStyleSheet);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.shadowRoot?.adoptedStyleSheets.splice(0, this.shadowRoot?.adoptedStyleSheets.length);
  }

  override render() {
    return html`<slot></slot>`;
  }
}
