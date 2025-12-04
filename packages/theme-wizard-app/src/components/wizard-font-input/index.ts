import '@nl-design-system-community/clippy-components/clippy-combobox';
import { ClippyCombobox } from '@nl-design-system-community/clippy-components/clippy-combobox';
import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import { WizardTokenInput } from '../wizard-token-input';

export type FontOption = { label: string; value: ModernFontFamilyToken['$value'] };

export const DEFAULT_FONT_OPTIONS: FontOption[] = [
  { label: 'System UI', value: ['system-ui', 'sans-serif'] },
  { label: 'Arial', value: ['Arial', 'sans-serif'] },
  { label: 'Georgia', value: ['Georgia', 'serif'] },
  { label: 'Times New Roman', value: ['Times New Roman', 'serif'] },
  { label: 'Courier New', value: ['Courier New', 'monospace'] },
  { label: 'Verdana', value: ['Verdana', 'sans-serif'] },
];

const tag = 'wizard-font-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFontInput;
  }
}

@customElement(tag)
export class WizardFontInput extends WizardTokenInput {
  @property() defaultOptionsLabel = 'Standaardopties';
  @property() optionsLabel = 'Opties';
  @property({ type: Array }) options: FontOption[] = [];
  readonly #token: ModernFontFamilyToken = {
    $type: 'fontFamily',
    $value: '',
  };

  @property({ reflect: true })
  override get value() {
    return this.#token.$value;
  }

  override set value(value: ModernFontFamilyToken['$value']) {
    const oldValue = this.#token.$value;
    this.#token.$value = value;
    this.internals_.setFormValue(WizardFontInput.valueAsString(value));
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof ClippyCombobox)) return;
    this.value = `${target.value}`;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override render() {
    return html`
      <div class="utrecht-form-field__input">
        <label id="label-${this.name}">${this.label}</label>
        ${this.errors.map(
          (error) =>
            html`<div class="utrecht-form-field-error-message" id=${error.id}>
              ${t(`validation.error.${error.code}.compact`, error)}
            </div>`,
        )}
        <clippy-combobox
          aria-labelledby="label-${this.name}"
          name=${this.name}
          @change=${this.#handleChange}
          .value=${this.value.toString()}
          .options=${DEFAULT_FONT_OPTIONS}
        ></clippy-combobox>
      </div>
    `;
  }
}
