import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import sidebarStyles from './sidebar.css';

const tag = 'wizard-sidebar';
// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardSidebar;
  }
}

@customElement(tag)
export class WizardSidebar extends LitElement {
  static override readonly styles = [sidebarStyles];

  override render() {
    return html`
      <div class="wizard-sidebar">
        <slot></slot>
      </div>
    `;
  }
}
