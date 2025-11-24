import { ModernFontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import { WizardTokenInput } from '../wizard-token-input';
import '../wizard-validation-issue';

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
  @property() options: FontOption[] = [];
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

    const optionIsValue = this.valueComparator(value);
    if (!DEFAULT_FONT_OPTIONS.some(optionIsValue) && !this.options.some(optionIsValue)) {
      const label = (Array.isArray(value) ? value[0] : value).replaceAll(/['"]/g, '');
      this.options.push({ label, value });
    }
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLSelectElement) {
      try {
        this.value = JSON.parse(event.target.value);
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      } catch {
        // reset to previous version when parsing fails
        event.target.value = WizardTokenInput.valueAsString(this.value);
      }
    }
  };

  valueComparator(value: FontOption['value'] = this.value) {
    // Simple conversion to string ought to be enough to compare
    return (option: FontOption) => `${option.value}` === `${value}`;
  }

  override render() {
    return html`
      <label for=${this.id}>${this.label}</label>
      ${this.issues.map(
        (issue) =>
          html`<div class="utrecht-form-field-error-message">
            ${t(`validation.error.${issue.code}.compact`, issue)}
          </div>`,
      )}
      <select id=${this.id} name=${this.name} @change=${this.#handleChange}>
        ${this.options.length
          ? html`<optgroup label=${this.optionsLabel}>
              ${this.options.map(
                (option) =>
                  html`<option
                    value=${WizardTokenInput.valueAsString(option.value)}
                    ?selected=${this.valueComparator(this.value)(option)}
                  >
                    ${option.label}
                  </option>`,
              )}
            </optgroup>`
          : nothing}
        <optgroup label=${this.defaultOptionsLabel}>
          ${DEFAULT_FONT_OPTIONS.map(
            (option) =>
              html`<option
                value=${WizardTokenInput.valueAsString(option.value)}
                ?selected=${this.valueComparator(this.value)(option)}
              >
                ${option.label}
              </option>`,
          )}
        </optgroup>
      </select>
    `;
  }
}
