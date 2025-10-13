/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_FONT_OPTIONS, type FontOption } from '../../constants';
import styles from './styles';

@customElement('font-select')
export class FontSelect extends LitElement {
  @property() name = '';
  @property() label = '';
  @property() optionsLabel = 'Opties';
  @property() options: FontOption[] = [];
  @property() defaultOptionsLabel = 'Standaardopties';
  internals_ = this.attachInternals();
  #id = 'font-select';
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
    const select = this.querySelector(`#${this.#id}`);
    if (select instanceof HTMLSelectElement) {
      this.#value = select.value;
    }
  }

  handleChange(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      this.value = event.target.value;
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  override render() {
    return html`
      <div class="theme-form-field">
        <label for=${this.#id} class="theme-form-field__label"> ${this.label} </label>
        <select
          id=${this.#id}
          name=${this.name}
          class="theme-form-field__select"
          .value=${this.value}
          @change=${this.handleChange}
        >
          ${this.options.length &&
          html`
            <optgroup label=${this.optionsLabel}>
              ${this.options.map(
                (opt) => html` <option value=${opt.value} ?selected=${opt.value === this.value}>${opt.label}</option>`,
              )}
            </optgroup>
          `}
          <optgroup label=${this.defaultOptionsLabel}>
            ${DEFAULT_FONT_OPTIONS.map(
              (opt) => html` <option value=${opt.value} ?selected=${opt.value === this.value}>${opt.label}</option>`,
            )}
          </optgroup>
        </select>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'font-select': FontSelect;
  }
}
