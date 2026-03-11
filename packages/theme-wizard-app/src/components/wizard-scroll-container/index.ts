import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-scroll-container';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScrollContainer;
  }
}

@customElement(tag)
export class WizardScrollContainer extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="wizard-scroll-container">
        <slot></slot>
      </div>
    `;
  }
}
