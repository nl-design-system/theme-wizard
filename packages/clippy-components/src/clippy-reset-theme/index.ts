import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import { createResetTheme } from './reset-theme';

// Module-level singleton: all instances share one CSSStyleSheet so the browser parses the CSS once.
// Lazily initialized to avoid errors in SSR environments where CSSStyleSheet is not available.
let resetThemeStyleSheet: CSSStyleSheet | undefined;

const getResetThemeStyleSheet = (): CSSStyleSheet => {
  if (!resetThemeStyleSheet) {
    resetThemeStyleSheet = new CSSStyleSheet();
    resetThemeStyleSheet.replaceSync(createResetTheme(':host'));
  }
  return resetThemeStyleSheet;
};

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
    this.shadowRoot?.adoptedStyleSheets.push(getResetThemeStyleSheet());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.shadowRoot?.adoptedStyleSheets.splice(0, this.shadowRoot?.adoptedStyleSheets.length);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

export * from './reset-css';
export * from './reset-theme';
