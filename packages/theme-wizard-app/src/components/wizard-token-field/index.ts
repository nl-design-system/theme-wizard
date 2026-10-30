import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import { type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import {
  type BaseDesignToken,
  type TokenReference,
  EXTENSION_RESOLVED_AS,
  EXTENSION_TOKEN_STAGED,
  extractRef,
  getExtension,
  getTokenSubtype,
  isRef,
  isTokenLike,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type ValidationIssue from '../../lib/ValidationIssue';
import type { Token } from '../wizard-token-input';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
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
  @consume({ context: themeContext, subscribe: true })
  private readonly theme!: Theme;
  @property() label: string = '';
  @property() path: string = '';
  #options: Option[] = [];

  @state() get token() {
    return this.theme?.at(this.path) as BaseDesignToken | undefined;
  }

  @state() get options() {
    return this.#options;
  }

  static override readonly styles = [unsafeCSS(codeCss), styles];

  override connectedCallback(): void {
    super.connectedCallback();
    const basisTokens = this.theme.tokens['basis'];
    // TODO: Find better way to guard against circular references in tokens.
    let tokenPathIsSameOrAhead = false;
    const filterByTypeAndPosition = ([path, { $type }]: [string, Token]) => {
      if ($type === this.token?.$type) {
        tokenPathIsSameOrAhead = tokenPathIsSameOrAhead || `basis.${path}` === this.path;
        return !tokenPathIsSameOrAhead;
      }
      return false;
    };
    // Build options for referencing basis tokens
    // TODO: only do this once and cache it, ideally in lib/Theme or its context provider,
    // rather than on every field instance.
    const expectedSubType = isTokenLike(this.token) && getTokenSubtype(this.token);
    this.#options =
      basisTokens && typeof basisTokens !== 'string'
        ? Object.entries(Theme.flatten(basisTokens as Record<string, BaseDesignToken>))
            .filter(filterByTypeAndPosition)
            .filter(([, token]) => {
              // Filter out the correct token sub-types
              if (expectedSubType && isTokenLike(token)) {
                return getTokenSubtype(token) === expectedSubType;
              }
              // Filter out only scraped tokens that were selected in the staging area
              if (getExtension(token, EXTENSION_TOKEN_STAGED) === false) {
                return false;
              }
              return true;
            })
            .map(([path, { $type, ...token }]) => {
              // Find the resolved value for color tokens to show in the combobox options.
              // Since tokens can reference other tokens, we check if the token is a reference and use the resolved value if so.
              const resolved = isRef(token.$value) ? getExtension(token, EXTENSION_RESOLVED_AS) : token.$value;
              const $value = `{basis.${path}}` satisfies TokenReference;
              const $extensions = {
                ...token['$extensions'],
                [EXTENSION_RESOLVED_AS]: structuredClone(resolved),
              };
              return {
                label: extractRef($value),
                value: {
                  $extensions,
                  $type,
                  $value,
                },
              };
            })
        : [];
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
    const label = this.label || `${this.path.split('.').at(-1)}`;

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
          <span slot="label">${label}</span>
          ${
            this.#hasErrors
              ? html`<div slot="error" class="utrecht-form-field-error-message">
                  ${t(`validation.error.${this.pathErrors[0].code}.compact`, this.pathErrors[0])}
                </div>`
              : nothing
          }
        </clippy-token-combobox>
      </div>
    `;
  }
}
