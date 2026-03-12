import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles';

const tag = 'wizard-stack';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStack;
  }
}

type StackSize = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

@customElement(tag)
export class WizardStack extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) size: StackSize = 'md';

  override render() {
    return html`
      <div class=${classMap({ [`wizard-stack--${this.size}`]: this.size !== 'none', 'wizard-stack': true })}>
        <slot></slot>
      </div>
    `;
  }
}
