import checkboxCss from '@utrecht/checkbox-css/dist/index.css?inline';
import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const tag = 'wizard-form-field-checkbox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFormFieldCheckbox;
  }
}

/**
 * NL Design System styled checkbox form field.
 *
 * @element wizard-form-field-checkbox
 */
@customElement(tag)
export class WizardFormFieldCheckbox extends LitElement {
  static override readonly styles = [unsafeCSS(checkboxCss), unsafeCSS(formFieldCss), unsafeCSS(formLabelCss)];

  static readonly formAssociated = true;

  private readonly internals_: ElementInternals;

  constructor() {
    super();
    this.internals_ = this.attachInternals();
  }

  @property({ type: Boolean })
  checked = false;

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = 'on';

  override firstUpdated() {
    this.internals_.setFormValue(this.checked ? this.value : null);
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.internals_.setFormValue(this.checked ? this.value : null);
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
              @change=${this.handleChange}
            />
            ${this.label}
          </label>
        </div>
      </div>
    `;
  }
}
