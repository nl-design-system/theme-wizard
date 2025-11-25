import { ColorToken, DimensionToken, FontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DesignToken } from 'style-dictionary/types';
import type ValidationIssue from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import { WizardTokenNavigator } from '../wizard-token-navigator';
import styles from './styles';

// TODO: use uniform token type that both conforms to the types of
// `@nl-design-system-community/design-tokens-schema` and `style-dictionary`
export type Token = ColorToken | DimensionToken | FontFamilyToken | DesignToken;

const tag = 'wizard-token-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenInput;
  }
}

@customElement(tag)
export class WizardTokenInput extends WizardTokenNavigator {
  @property() label = '';
  @property() name = '';
  @property() errors: ValidationIssue[] = [];
  internals_ = this.attachInternals();
  #token: Token = {};

  static readonly formAssociated = true;
  static override readonly styles = [styles];

  static valueAsString(value: unknown) {
    switch (typeof value) {
      case 'string':
        return value;
      case 'object':
        return JSON.stringify(value, null, 2);
      case 'number':
      default:
        return `${value}`;
    }
  }

  @property({ reflect: true })
  get value() {
    return this.#token?.$value || this.#token;
  }

  set value(value: unknown) {
    const oldToken = this.#token;
    const oldValue = oldToken?.$value;

    if (oldValue) {
      this.#token.$value = value;
    } else {
      this.#token = value as Token;
    }
    this.internals_.setFormValue(WizardTokenInput.valueAsString(value));
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      try {
        this.value = JSON.parse(event.target.value) as DesignToken;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      } catch {
        // reset to previous version when parsing fails
        event.target.value = WizardTokenInput.valueAsString(this.value);
      }
    }
  };

  override render() {
    const hasErrors = this.errors.length > 0;
    return html` <label for=${this.id}>${this.label}</label>
      ${this.errors.map(
        (error) =>
          html`<div class="utrecht-form-field-error-message">
            ${t(`validation.error.${error.code}.compact`, error)}
          </div>`,
      )}
      <textarea
        id=${this.id}
        name=${this.name}
        class=${hasErrors ? 'theme-error' : ''}
        .value=${WizardTokenInput.valueAsString(this.value)}
        @change=${this.#handleChange}
      ></textarea>`;
  }
}
