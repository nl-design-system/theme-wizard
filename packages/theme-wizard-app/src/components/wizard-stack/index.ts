import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-stack';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStack;
  }
}

/* eslint-disable perfectionist/sort-objects */
const CLASSNAME_MAP = {
  none: 'wizard-stack--none',
  '2xs': 'wizard-stack--2xs',
  xs: 'wizard-stack--xs',
  sm: 'wizard-stack--sm',
  md: 'wizard-stack--md',
  lg: 'wizard-stack--lg',
  xl: 'wizard-stack--xl',
  '2xl': 'wizard-stack--2xl',
  '3xl': 'wizard-stack--3xl',
  '4xl': 'wizard-stack--4xl',
  '5xl': 'wizard-stack--5xl',
  '6xl': 'wizard-stack--6xl',
};
/* eslint-enable perfectionist/sort-objects */

type StackSize = keyof typeof CLASSNAME_MAP;

@customElement(tag)
export class WizardStack extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) size: StackSize = 'md';

  override render() {
    return html`
      <div class="wizard-stack ${CLASSNAME_MAP[this.size] ?? ''}">
        <slot></slot>
      </div>
    `;
  }
}
