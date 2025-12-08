import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import logoSvg from '../../assets/nl-design-system-beeldmerk.svg?raw';
import styles from './styles';

const tag = 'wizard-logo';
// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardLogo;
  }
}

@customElement(tag)
export class WizardLogo extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="wizard-logo">
        ${unsafeHTML(logoSvg)}
        <utrecht-heading-1>
          <span>Theme</span>
          <span>Wizard</span>
        </utrecht-heading-1>
      </div>
    `;
  }
}
