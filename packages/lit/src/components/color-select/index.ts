import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import styles from './styles';

type ColorOption = {
  label: string;
  value: string;
  token: ColorToken;
};

@customElement('color-select')
export class ColorSelect extends LitElement {
  @property() name = '';
  @property() label = '';
  @property() options: ColorOption[] = [];
  internals_ = this.attachInternals();
  #value = '';

  static override styles = [styles];
  static formAssociated = true;

  @property({ reflect: true })
  get value() {
    return this.#value;
  }

  set value(val: string) {
    const oldValue = this.#value;
    this.#value = val;
    this.internals_.setFormValue(val);
    this.requestUpdate('value', oldValue);
  }

  override connectedCallback() {
    super.connectedCallback();
  }

  handleChange(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      this.value = event.target.value;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  override render() {
    return html`
      <fieldset class="theme-color-select">
        <legend class="theme-color-select__label">${this.label}</legend>
        <div class="theme-color-select__options">
          ${this.options.map(
            ({ label, token, value }) => html`
              <label class="theme-color-select__option">
                <input type="checkbox" value=${value} name="${this.name}[]" />
                <var class="theme-color-select__swatch" style="background-color: ${token.toCSSColorFunction()}"></var>
                <span>${label}</span>
              </label>
            `,
          )}
        </div>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-select': ColorSelect;
  }
}
