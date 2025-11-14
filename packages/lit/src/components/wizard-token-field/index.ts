import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-color-input';
import '../wizard-font-input';
import '../wizard-token-input';
import { Token } from '../wizard-token-input';

const tag = 'wizard-token-field';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenField;
  }
}

@customElement(tag)
export class WizardTokenField extends LitElement {
  @property() label: string = '';
  @property() token: Token = {};
  @property() path: string = '';
  @property() options = [];
  @property({ type: Number }) depth = 0;

  static maxDepth = 3;

  get #id() {
    return `input-${this.path}`;
  }

  get entries() {
    return WizardTokenField.entries(this.token);
  }

  get type() {
    switch (this.token?.$type) {
      case 'color':
        return 'color';
      case 'dimension':
        return 'number';
      case 'fontFamily':
      case 'fontFamilies':
        return 'font';
      default:
        return undefined;
    }
  }

  get value() {
    return this.token?.$value;
  }

  renderField(type: typeof this.type) {
    const key = this.path.split('.').pop();
    switch (type) {
      case 'color':
        return html` <wizard-color-input
          .value=${this.token.$value}
          id=${this.#id}
          name=${this.path}
          key=${key}
        ></wizard-color-input>`;
      case 'font':
        return html` <wizard-font-input
          .value=${this.token.$value}
          id=${this.#id}
          name=${this.path}
          key=${key}
        ></wizard-font-input>`;
      default:
        return html` <wizard-token-input
          .value=${this.token}
          id=${this.#id}
          name=${this.path}
          key=${key}
        ></wizard-token-input>`;
    }
  }

  override render() {
    if (this.depth > WizardTokenField.maxDepth) return nothing;
    const type = this.type;
    const label = this.label || `{${this.path}}`;
    return html`<div>
      ${type
        ? html`
            <label for=${this.#id}>${label}</label>
            ${this.renderField(type)}
          `
        : html`<p for=${this.#id}>${label}</p>
            <ul>
              ${this.entries.map(
                ([key, token]) => html`
                  <li>
                    <wizard-token-field
                      .token=${token}
                      path=${`${this.path}.${key}`}
                      depth=${this.depth + 1}
                    ></wizard-token-field>
                  </li>
                `,
              )}
            </ul>`}
    </div>`;
  }

  static entries(token: Token) {
    return Object.entries(token).filter((entry): entry is [string, Token] => !entry[0].startsWith('$'));
  }
}
