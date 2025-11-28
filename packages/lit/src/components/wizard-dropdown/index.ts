import selectStyles from '@utrecht/select-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type DropdownOption = {
  name: string;
  value: string;
  detail?: Array<{
    name: string;
    value: string;
  }>;
};

const tag = 'wizard-dropdown';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardDropdown;
  }
}

@customElement(tag)
export class WizardDropdown extends LitElement {
  @property() name = '';
  @property() label = 'Selecteer een optie';
  @property() isOptgroup = false;
  @property({ reflect: true }) value = '';
  #options: DropdownOption[] = [];

  static override readonly styles = [unsafeCSS(selectStyles)];

  static readonly formAssociated = true;
  readonly #internals = this.attachInternals();

  @property()
  get options() {
    const optionForValue = this.#options.find(({ value }) => value === this.value);
    return optionForValue ? this.#options : [{ name: this.value, value: this.value }, ...this.#options];
  }

  set options(value: DropdownOption[]) {
    this.#options = value;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Ensure initial form value reflects current value
    this.#internals.setFormValue(this.value);
  }

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLSelectElement) {
      const newValue = event.target.value;
      if (newValue !== this.value) {
        this.value = newValue;
        this.#internals.setFormValue(this.value);
      }
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  override render() {
    return html`
      <label for=${this.name}>${this.label}</label>
      <select
        id=${this.name}
        class="utrecht-select utrecht-select--html-select"
        .value=${this.value}
        @change=${this.#handleChange}
      >
        ${this.options.map(
          (option) => html`
            ${this.isOptgroup
              ? html` <optgroup label="${option.name}">
                  ${option.detail?.map(
                    (detail) =>
                      html` <option value="${detail.value}" ?selected=${detail.value === this.value}>
                        ${detail.name}
                      </option>`,
                  )}
                </optgroup>`
              : html` <option value="${option.value}" ?selected=${option.value === this.value}>${option.name}</option>`}
          `,
        )}
      </select>
    `;
  }
}
