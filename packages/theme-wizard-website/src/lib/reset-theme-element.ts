import { createResetTheme } from './reset-theme';

const resetThemeStyleSheet = new CSSStyleSheet();
resetThemeStyleSheet.replaceSync(createResetTheme(':host'));

export class ResetThemeElement extends HTMLElement {
  _shadowRoot: ShadowRoot;
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot?.adoptedStyleSheets.push(resetThemeStyleSheet);
    this._shadowRoot.appendChild(this.ownerDocument.createElement('slot'));
  }
}

customElements.define('reset-theme', ResetThemeElement);
