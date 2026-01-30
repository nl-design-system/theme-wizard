import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-sidebar-link';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardSidebarLink;
  }
}

@customElement(tag)
export class WizardSidebarLink extends LitElement {
  @property() href?: string = '';

  static override readonly styles = [styles];

  override render() {
    return html`
      <a class="wizard-sidebar-link" href=${this.href}>
        <slot></slot>
      </a>
    `;
  }
}
