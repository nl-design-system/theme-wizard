import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-container';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardContainer;
  }
}

type ContainerWidth = 'default' | 'page' | 'sm' | 'md' | 'lg' | 'xl';

/* eslint-disable perfectionist/sort-objects */
const CLASSNAME_MAP: Record<ContainerWidth, string> = {
  default: '',
  page: 'wizard-container--page',
  sm: 'wizard-container--sm',
  md: 'wizard-container--md',
  lg: 'wizard-container--lg',
  xl: 'wizard-container--xl',
};
/* eslint-enable perfectionist/sort-objects */

@customElement(tag)
export class WizardContainer extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) size: ContainerWidth = 'default';

  override render() {
    return html`
      <div class="wizard-container ${CLASSNAME_MAP[this.size] ?? ''}">
        <slot></slot>
      </div>
    `;
  }
}
