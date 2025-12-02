import { isRef } from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-color-input';
import '../wizard-font-input';
import '../wizard-token-input';
import type ValidationIssue from '../../lib/ValidationIssue';
import { Token } from '../wizard-token-input';
import { WizardTokenNavigator } from '../wizard-token-navigator';
import styles from './styles';

const tag = 'wizard-token-field';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenField;
  }
}

@customElement(tag)
export class WizardTokenField extends WizardTokenNavigator {
  @property() label: string = '';
  @property() token: Token = {};
  @property() path: string = '';
  @property() options = [];
  @property({ attribute: false })
  errors: ValidationIssue[] = [];
  @property({ type: Number }) depth = 0;

  static readonly maxDepth = 3;

  static override readonly styles = [styles];

  get #id() {
    return `input-${this.path}`;
  }

  get #hasErrors(): boolean {
    return this.#pathErrors.length > 0 || this.#hasNestedErrors;
  }

  get #hasNestedErrors(): boolean {
    if (!this.path) {
      return this.errors.length > 0;
    }

    return this.errors.some((error) => error.path.startsWith(this.path + '.'));
  }

  get #pathErrors(): ValidationIssue[] {
    return this.errors.filter((error) => error.path === this.path);
  }

  #getChildPathErrors(childPath: string): ValidationIssue[] {
    return this.errors.filter((error) => error.path.startsWith(childPath));
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

  renderField(type: typeof this.type, label: string) {
    const key = this.path.split('.').pop();

    if (isRef(this.value)) {
      return html`
        <span>${label}</span>
        <span>&rarr; ${this.value}</span>
      `;
    }

    switch (type) {
      case 'color':
        return html` <wizard-color-input
          .errors=${this.#pathErrors}
          .value=${this.token.$value}
          id=${this.#id}
          key=${key}
          label=${label}
          name=${this.path}
        >
          ${label}
        </wizard-color-input>`;
      case 'font':
        return html` <wizard-font-input
          .errors=${this.#pathErrors}
          .value=${this.token.$value}
          id=${this.#id}
          key=${key}
          label=${label}
          name=${this.path}
        >
          ${label}
        </wizard-font-input>`;
      default:
        return html` <wizard-token-input
          .errors=${this.#pathErrors}
          .value=${this.token}
          id=${this.#id}
          key=${key}
          label=${label}
          name=${this.path}
        >
          ${label}
        </wizard-token-input>`;
    }
  }

  override render() {
    if (this.depth > WizardTokenField.maxDepth) return nothing;
    const type = this.type;
    const label = this.label || `${this.path.split('.').at(-1)}`;
    const errorClass = this.#hasErrors ? 'theme-error' : '';
    return html`
      ${type
        ? this.renderField(type, label)
        : html`<p class=${errorClass}>${label}</p>
            <ul>
              ${this.entries.map(([key, token]) => {
                const path = `${this.path}.${key}`;
                const depth = this.depth + 1;
                return html`
                  <li>
                    <wizard-token-field
                      .token=${token}
                      .errors=${this.#getChildPathErrors(path)}
                      path=${path}
                      depth=${depth}
                    ></wizard-token-field>
                  </li>
                `;
              })}
            </ul>`}
    `;
  }

  static entries(token: Token) {
    return Object.entries(token).filter((entry): entry is [string, Token] => !entry[0].startsWith('$'));
  }
}
