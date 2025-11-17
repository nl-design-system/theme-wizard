import { ColorSpace, parseColor } from '@nl-design-system-community/design-tokens-schema';
import formFieldError from '@utrecht/form-field-error-message-css?inline';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import { WizardTokenInput } from '../wizard-token-input';
import styles from './styles';

const tag = 'wizard-color-input';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardColorInput;
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color
 * @returns boolean
 */
const getSupportsCSSColorValues = () => {
  const el = document.createElement('input');
  el.type = 'color';
  el.value = 'hsl(0 100% 50%)';
  const hasSupport = el.value !== '#000000';
  el.remove();
  return hasSupport;
};

@customElement(tag)
export class WizardColorInput extends WizardTokenInput {
  static readonly supportsCSSColorValues = getSupportsCSSColorValues();
  readonly #token = new ColorToken({
    $value: parseColor('black'),
  });

  @property({ reflect: true })
  override get value() {
    return this.#token.$value;
  }

  get colorSpace(): ColorSpace {
    return this.#token.$value?.colorSpace || 'srgb';
  }

  override set value(value: ColorToken['$value']) {
    const oldValue = this.#token.$value;
    this.#token.$value = value;
    this.internals_.setFormValue(WizardColorInput.valueAsString(value));
    this.requestUpdate('value', oldValue);
  }

  static override styles = [styles, unsafeCSS(formFieldError)];

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.value = parseColor(event.target.value);
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override render() {
    const colorValue = this.#token.$value;
    const hasValidColor = colorValue && Array.isArray(colorValue.components) && colorValue.components.length === 3;
    const colorString = hasValidColor
      ? WizardColorInput.supportsCSSColorValues
        ? this.#token.toCSSColorFunction()
        : this.#token.toHex()
      : '#000000';

    return html` <label for=${this.id}>${this.label}</label>

      <input
        type="color"
        id=${this.id}
        value=${colorString}
        colorSpace=${this.colorSpace}
        @change=${this.#handleChange}
      />
      ${this.errors.length &&
      html`<div class="error">
        ${this.errors.map(
          ({ issue }) => html`<div class="utrecht-form-field-error-message"><p>${issue.message}</p></div>`,
        )}
      </div>`}`;
  }
}
