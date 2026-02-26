import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import logoSvg from '../../assets/nl-design-system-beeldmerk.svg?raw';
import styles from './styles';
import '@nl-design-system-community/clippy-components/clippy-heading';

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
        ${unsafeSVG(logoSvg)}
        <clippy-heading level="1">
          <span>Theme</span>
          <span>Wizard</span>
        </clippy-heading>
      </div>
    `;
  }
}
