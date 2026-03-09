import { LitElement, html, nothing } from 'lit';
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
  @property() current?: string = undefined;

  static override readonly styles = [styles];

  override render() {
    return html`
      <a class="wizard-sidebar-link" href=${this.href} aria-current=${this.current ?? nothing}>
        <slot></slot>
      </a>
    `;
  }
}
