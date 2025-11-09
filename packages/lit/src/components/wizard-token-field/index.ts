import type { ColorToken, DimensionToken, FontFamilyToken } from '@nl-design-system-community/design-tokens-schema';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DesignToken } from 'style-dictionary/types';

const tag = 'wizard-token-field';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenField;
  }
}

@customElement(tag)
export class WizardTokenField extends LitElement {
  @property() token: ColorToken | DimensionToken | FontFamilyToken | DesignToken = {};
  @property() path: string = '';
  @property() options = [];
  @property({ type: Number }) depth = 0;

  static maxDepth = 3;

  get entries() {
    const entries = Object.entries(this.token).filter(([key]) => !key.startsWith('$'));
    return entries;
  }

  get inputType() {
    switch (this?.token?.$type) {
      case 'color':
        return 'color';
      case 'dimension':
        return 'number';
      case 'fontfamily':
      case 'fontfamilies':
        return 'text';
      default:
        return undefined;
    }
  }

  get value() {
    return this.token?.$value;
  }

  override render() {
    if (this.depth > WizardTokenField.maxDepth) return nothing;

    const inputType = this.inputType;
    const label = `{${this.path}}`;
    return inputType
      ? html` ${label} `
      : html`
          <p>${label}</p>
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
          </ul>
        `;
  }
}
