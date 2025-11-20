import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type ValidationIssue from '../../lib/ValidationIssue';
import '../wizard-color-input';
import '../wizard-font-input';
import '../wizard-token-input';
import { Token } from '../wizard-token-input';
import styles from './styles';

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
  @property({ attribute: false })
  issues: ValidationIssue[] = [];
  @property({ type: Number }) depth = 0;

  static maxDepth = 3;

  static override readonly styles = [styles];

  get #id() {
    return `input-${this.path}`;
  }

  get #pathIssues(): ValidationIssue[] {
    return this.issues.filter((issue) => issue.path === this.path);
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
    switch (type) {
      case 'color':
        return html` <wizard-color-input
          .issues=${this.#pathIssues}
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
          .issues=${this.#pathIssues}
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
          .issues=${this.#pathIssues}
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
    const label = this.label || `{${this.path}}`;
    const errorClass = this.#pathIssues ? 'theme-error' : '';
    return html`<div>
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
                      .issues=${this.issues}
                      path=${path}
                      depth=${depth}
                    ></wizard-token-field>
                  </li>
                `;
              })}
            </ul>`}
    </div>`;
  }

  static entries(token: Token) {
    return Object.entries(token).filter((entry): entry is [string, Token] => !entry[0].startsWith('$'));
  }
}
