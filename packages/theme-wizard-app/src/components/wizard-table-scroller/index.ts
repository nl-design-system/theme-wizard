import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-table-scroller';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTableScroller;
  }
}

@customElement(tag)
export class WizardTableScroller extends LitElement {
  static override readonly styles = [styles];

  /**
   * These must be inline styles, not `:host` CSS rules. When the parent grid
   * (wizard-stack) sizes this element, it only sees styles from its own shadow
   * scope — `:host` rules from this component's shadow root are invisible to it.
   * That means `overflow-x: auto` via CSS never registers as a scroll container,
   * so the grid still expands to the table's min-content width. Inline styles sit
   * on the element itself and are always visible across shadow DOM boundaries.
   */
  override connectedCallback() {
    super.connectedCallback();
    this.style.inlineSize = '100%';
    this.style.overflowX = 'auto';
  }

  override render() {
    return html`<slot></slot>`;
  }
}
