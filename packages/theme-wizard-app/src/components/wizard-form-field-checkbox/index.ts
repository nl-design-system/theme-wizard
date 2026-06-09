import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const tag = 'wizard-form-field-checkbox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFormFieldCheckbox;
  }
}

/**
 * NL Design System styled checkbox form field. Uses no shadow root
 * (`createRenderRoot` returns `this`) so the native `<input>` participates in
 * ancestor form submission.
 *
 * @element wizard-form-field-checkbox
 */
@customElement(tag)
export class WizardFormFieldCheckbox extends LitElement {
  @property({ type: Boolean })
  checked = false;

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  // No shadow root: native input must be in the same shadow root as its ancestor form to participate in form submission.
  override createRenderRoot() {
    return this;
  }

  override render() {
    return html`
      <div class="utrecht-form-field utrecht-form-field--checkbox">
        <div class="utrecht-form-field__label utrecht-form-field__label--checkbox">
          <label for=${this.name} class="utrecht-form-label utrecht-form-label--checkbox">
            <input
              type="checkbox"
              name=${this.name}
              id=${this.name}
              class="utrecht-checkbox utrecht-checkbox--html-input utrecht-checkbox--custom utrecht-form-field__input"
              ?checked=${this.checked}
            />
            ${this.label}
          </label>
        </div>
      </div>
    `;
  }
}
