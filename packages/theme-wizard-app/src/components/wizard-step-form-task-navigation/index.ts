import '@nl-design-system-community/clippy-components/clippy-task-navigation';
import CircleCheckFilled from '@tabler/icons/filled/circle-check.svg?raw';
import ChevronRight from '@tabler/icons/outline/chevron-right.svg?raw';
import CircleDashed from '@tabler/icons/outline/circle-dashed.svg?raw';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
    return html`
      <clippy-task-navigation href=${this.href}>
        <span slot="iconStart" class="wizard-step-form-task-navigation-icon-start">
          ${unsafeSVG(this.done ? CircleCheckFilled : CircleDashed)}
        </span>
        <slot></slot>
        <span slot="actions">${unsafeSVG(ChevronRight)}</span>
      </clippy-task-navigation>
    `;
  }
}
