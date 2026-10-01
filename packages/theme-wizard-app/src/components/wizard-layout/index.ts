import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../wizard-logo';
import styles from './styles';
import '@nl-design-system-community/clippy-components/clippy-page-layout';
import '@nl-design-system-community/clippy-components/clippy-page-header';

const tag = 'wizard-layout';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardLayout;
  }
}

@customElement(tag)
export class WizardLayout extends LitElement {
  static override readonly styles = [styles];

  @state() private hasSidebar = false;
  @state() private hasAside = false;

  private onSidebarSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasSidebar = slot.assignedElements().length > 0;
  }

  private onAsideSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasAside = slot.assignedElements().length > 0;
  }

  override render() {
    return html`
      <clippy-page-layout class="wizard-layout">
        <slot name="page-header" slot="header"></slot>

        <div class="wizard-layout__body">
          <div class="wizard-layout__sidebar" ?hidden=${!this.hasSidebar}>
            <slot name="sidebar" @slotchange=${this.onSidebarSlotChange}></slot>
          </div>
          <div class="wizard-layout__aside" ?hidden=${!this.hasAside}>
            <slot name="aside-nav" @slotchange=${this.onAsideSlotChange}></slot>
          </div>
          <section class="wizard-layout__main">
            <slot name="main"></slot>
          </section>
        </div>

        <wizard-page-footer slot="footer"></wizard-page-footer>
      </clippy-page-layout>
    `;
  }
}
