import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('template-code')
export class TemplateCode extends LitElement {
  static override readonly styles = [unsafeCSS(codeCss)];

  override render() {
    return html`<code class="nl-code"><slot></slot></code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'template-code': TemplateCode;
  }
}
