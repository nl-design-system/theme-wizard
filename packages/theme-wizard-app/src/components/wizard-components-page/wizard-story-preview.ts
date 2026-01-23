import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

const tag = 'wizard-story-preview';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStoryPreview;
  }
}

@customElement(tag)
export class WizardStoryPreview extends LitElement {
  override render() {
    return html`
      <div
        class="preview-theme"
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
        "
      >
        <slot></slot>
      </div>
    `;
  }
}
