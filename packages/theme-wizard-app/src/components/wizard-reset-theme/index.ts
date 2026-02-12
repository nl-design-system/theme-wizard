import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createResetTheme } from './reset-theme';

const resetThemeStyleSheet = new CSSStyleSheet();
resetThemeStyleSheet.replaceSync(createResetTheme(':host'));

const tag = 'wizard-reset-theme';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardResetTheme;
  }
}

@customElement(tag)
export class WizardResetTheme extends LitElement {
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
