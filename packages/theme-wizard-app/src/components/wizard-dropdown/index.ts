import srOnlyStyles from '@nl-design-system-community/clippy-components/lib/sr-only';
import selectStyles from '@utrecht/select-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

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
  @property() options: DropdownOption[] = [];
  @property() isOptgroup = false;
  @property({ reflect: true }) value = '';

  static override readonly styles = [unsafeCSS(selectStyles), unsafeCSS(srOnlyStyles), styles];

  static readonly formAssociated = true;
  readonly #internals = this.attachInternals();

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
      <label for=${this.name} class="sr-only">${this.label}</label>
      <select
        id=${this.name}
        name=${this.name}
        class="utrecht-select utrecht-select--html-input"
        .value=${this.value}
        @change=${this.#handleChange}
      >
        <button>
          <selectedcontent></selectedcontent>
          <span class="wizard-dropdown__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M18.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1 -1.414 0l-6 -6a1 1 0 0 1 1.414 -1.414l5.293 5.293l5.293 -5.293a1 1 0 0 1 1.414 0" />
            </svg>
          <span>
        </button>
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
