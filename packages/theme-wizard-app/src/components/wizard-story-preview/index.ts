import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-story-preview';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryPreview;
  }
}

@customElement(tag)
export class WizardStoryPreview extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <div class="wizard-story-preview">
        <slot></slot>
      </div>
    `;
  }
}
