import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import formFieldErrorMessageCss from '@nl-design-system-candidate/form-field-error-message-css/form-field-error-message.css?inline';
import { type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { type BaseDesignToken, isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import { type PropertyValues, LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type Theme from '../../lib/Theme';
import type ValidationIssue from '../../lib/ValidationIssue';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { getOptionsFor } from './reference-options';
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
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;
  @property() label: string = '';
  @property() path: string = '';
  @state() private options: Option[] = [];

  get token() {
    return this.theme?.at(this.path) as BaseDesignToken | undefined;
  }

  static override readonly styles = [unsafeCSS(codeCss), unsafeCSS(formFieldErrorMessageCss), styles];

  protected override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('theme') || changedProperties.has('path')) {
      const { token } = this;
      this.options = this.theme && isTokenLike(token) ? getOptionsFor(this.theme.tokens, this.path, token) : [];
    }
  }

  get #hasErrors(): boolean {
    return this.pathErrors.length > 0;
  }

  protected get pathErrors(): ValidationIssue[] {
    return this.theme.issuesAt(this.path);
  }

  get value() {
    return this.token?.$value;
  }

  override render() {
    const { token } = this;
    if (!isTokenLike(token)) {
      return nothing;
    }
    const label = this.label || this.path;

    return html`
      <div class="wizard-token-field ${classMap({ 'wizard-token-field--invalid': this.#hasErrors })}">
        <clippy-token-combobox
          name=${this.path}
          hidden-label=${label}
          type=${token.$type}
          .invalid=${this.#hasErrors}
          .value=${token}
          .options=${this.options}
        >
          <span slot="label" class="wizard-token-field__label">${label}</span>
          ${
            this.#hasErrors
              ? html`<div slot="error" class="nl-form-field-error-message | wizard-token-field__error">
                  <div class="nl-form-field-error-message__content">
                    ${t(`validation.error.${this.pathErrors[0].code}.message`, this.pathErrors[0])}
                  </div>
                </div>`
              : nothing
          }
        </clippy-token-combobox>
      </div>
    `;
  }
}
