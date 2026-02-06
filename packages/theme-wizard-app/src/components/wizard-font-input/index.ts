import '@nl-design-system-community/clippy-components/clippy-font-combobox';
import { ClippyFontCombobox } from '@nl-design-system-community/clippy-components/clippy-font-combobox';
import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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
    if (!(target instanceof ClippyFontCombobox)) return;
    this.value = target.value ?? '';
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override render() {
    const value = Array.isArray(this.value) ? this.value : [this.value];
    const invalid = this.hasErrors ? 'true' : undefined;

    return html`
      <div class="utrecht-form-field__input">
        ${this.errors.map(
          (error) =>
            html`<div class="utrecht-form-field-error-message" id=${error.id}>
              ${t(`validation.error.${error.code}.compact`, error)}
            </div>`,
        )}
        <clippy-font-combobox
          label="${this.label}"
          name=${this.name}
          @change=${this.#handleChange}
          .value=${value}
          .options=${DEFAULT_FONT_OPTIONS}
          invalid=${ifDefined(invalid)}
        >
        </clippy-font-combobox>
      </div>
    `;
  }
}
