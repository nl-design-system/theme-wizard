import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('theme-wizard-code')
export class ThemeWizardCode extends LitElement {
  static override readonly styles = [unsafeCSS(codeCss)];

  override render() {
    return html`<code class="nl-code"><slot></slot></code>`;
  }
}
