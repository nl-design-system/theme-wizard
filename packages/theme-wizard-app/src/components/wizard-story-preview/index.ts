import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
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

  @property({ reflect: true, type: String }) size: string | undefined;

  override render() {
    return html`
      <div class="wizard-story-preview ${classMap({ 'wizard-story-preview--lg': this.size === 'lg' })}">
        <slot></slot>
      </div>
    `;
  }
}
