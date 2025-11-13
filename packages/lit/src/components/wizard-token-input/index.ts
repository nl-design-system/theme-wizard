import { ColorToken, DimensionToken, FontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DesignToken } from 'style-dictionary/types';

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
export class WizardTokenInput extends LitElement {
  @property() name = '';
  internals_ = this.attachInternals();
  #token: Token = {};

  static formAssociated = true;

  static valueToString(value: unknown) {
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
    this.internals_.setFormValue(WizardTokenInput.valueToString(value));
    this.requestUpdate('value', oldValue);
  }

  readonly #handleChange = (event: Event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      try {
        this.value = JSON.parse(event.target.value) as DesignToken;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      } catch {
        // reset to previous version when parsing fails
        event.target.value = WizardTokenInput.valueToString(this.value);
      }
    }
  };

  override render() {
    return html`<textarea
      id=${this.id}
      name=${this.name}
      .value=${WizardTokenInput.valueToString(this.value)}
      @change=${this.#handleChange}
      .value=${WizardTokenInput.valueToString(this.value)}
    ></textarea>`;
  }
}
