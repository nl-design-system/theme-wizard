import { ColorSpace, parseColor } from '@nl-design-system-community/design-tokens-schema';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import { WizardTokenInput } from '../wizard-token-input';

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
    return this.#token.$value.colorSpace;
  }

  override set value(value: ColorToken['$value']) {
    const oldValue = this.#token.$value;
    this.#token.$value = value;
    this.internals_.setFormValue(WizardColorInput.valueToString(value));
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.value = parseColor(event.target.value);
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override render() {
    return html`<input
      type="color"
      id=${this.id}
      value=${WizardColorInput.supportsCSSColorValues ? this.#token.toCSSColorFunction() : this.#token.toHex()}
      colorSpace=${this.colorSpace}
      @change=${this.#handleChange}
    />`;
  }
}
