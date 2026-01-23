import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const tag = 'wizard-code-block';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardCodeBlock;
  }
}

@customElement(tag)
export class WizardCodeBlock extends LitElement {
  @property({ type: String })
  language: string = '';

  @state()
  private code: string = '';

  #handleSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    const textContent = nodes
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent || '';
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          return (node as HTMLElement).textContent || '';
        }
        return '';
      })
      .join('');
    this.code = textContent.trim();
  }

  override render() {
    return html`
      <pre
        style="
          background-color: white;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.1);
          box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
          margin-block-end: 40px;
          margin-block-start: 25px;
          padding-block-end: 30px;
          padding-block-start: 30px;
          padding-inline-end: 20px;
          padding-inline-start: 20px;
          position: relative;
          font-family: monospace;
          font-size: 16px;
          white-space: pre;
          tab-size: 2;
        "
      >
        <code>${this.code}</code>
      </pre
      >
      <slot style="display: none;" @slotchange=${this.#handleSlotChange}></slot>
    `;
  }
}
