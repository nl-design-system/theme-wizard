import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import Check from '@tabler/icons/filled/check.svg?raw';
import ChevronRight from '@tabler/icons/outline/chevron-right.svg?raw';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';

const tag = 'wizard-step-form-task-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepFormTaskNavigation;
  }
}

@customElement(tag)
export class WizardStepFormTaskNavigation extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String }) href = '';
  @property({ type: Boolean }) done = false;

  override render() {
    // TODO:
    return html`
      <clippy-task-navigation href=${this.href}>
        <span
          slot="iconStart"
          class="wizard-step-form-task-navigation-icon-start ${classMap({
            'wizard-step-form-task-navigation-icon-start--checked': this.done,
          })}"
        >
          ${this.done ? unsafeSVG(Check) : nothing}
        </span>
        <slot></slot>
        <span slot="actions">${unsafeSVG(ChevronRight)}</span>
      </clippy-task-navigation>
    `;
  }
}
