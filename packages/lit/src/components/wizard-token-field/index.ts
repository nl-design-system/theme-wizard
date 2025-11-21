import { EXTENSION_RESOLVED_AS, isRef } from '@nl-design-system-community/design-tokens-schema';
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
  @property() options: Token[] = [];
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

    const disabled = isRef(this.token.$value);
    const refValue = this.token.$extensions?.[EXTENSION_RESOLVED_AS];

    switch (type) {
      case 'color':
        return html` <wizard-color-input
          .errors=${this.#pathErrors}
          .value=${refValue || this.token.$value}
          ?disabled=${disabled}
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
          .value=${refValue || this.token.$value}
          ?disabled=${disabled}
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
          .value=${refValue || this.token.$value}
          ?disabled=${disabled}
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
    const label = this.label || `{${this.path}}`;
    const errorClass = this.#hasErrors ? 'theme-error' : '';
    const ref = isRef(this.token.$value) ? this.token.$value : '';
    const options = this.options;
    return html`
      ${type
        ? html`<div>
            ${options.length ? html`<wizard-ref-select value=${ref} options=${options}></wizard-ref-select>` : nothing}
            ${this.renderField(type, label)}
          </div>`
        : html`<details>
            <summary><span class=${errorClass}>${label}</span></summary>
            ${this.entries.map(([key, token], _, array) => {
              const path = `${this.path}.${key}`;
              const depth = this.depth + 1;
              const options = [
                ...this.options,
                ...array.map(key => `${this.path}.${key}`),
              ];
              return html`
                <wizard-token-field
                  .token=${token}
                  .errors=${this.#getChildPathErrors(path)}
                  path=${path}
                  depth=${depth}
                  options=${options}
                ></wizard-token-field>
              `;
            })}
          </details>`}
    `;
  }

  static entries(token: Token) {
    return typeof token !== 'string'
      ? Object.entries(token).filter((entry): entry is [string, Token] => !entry[0].startsWith('$'))
      : [];
  }
}
