import { consume } from '@lit/context';
import codeCss from '@nl-design-system-candidate/code-css/code.css?inline';
import { EXTENSION_RESOLVED_AS, isRef } from '@nl-design-system-community/design-tokens-schema';
import '../wizard-token-combobox';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type ValidationIssue from '../../lib/ValidationIssue';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
import { type Option } from '../wizard-token-combobox';
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
  @consume({ context: themeContext })
  private readonly theme!: Theme;
  @property() label: string = '';
  @property() path: string = '';
  @property({ attribute: false }) errors: ValidationIssue[] = [];
  @property({ type: Number }) depth = 0;
  #options: Option[] = [];

  @state() token: Token = {};
  @state() get options() {
    return this.#options;
  }

  static readonly maxDepth = 3;

  static override readonly styles = [unsafeCSS(codeCss), styles];

  override connectedCallback(): void {
    super.connectedCallback();
    const basisTokens = this.theme.tokens['basis'];
    this.token = this.theme.at(this.path);
    // TODO: Find better way to guard against circular references in tokens.
    let tokenPathIsSameOrAhead = false;
    const filterByTypeAndPosition = ([path, { $type }]: [string, Token]) => {
      if ($type === this.token.$type) {
        tokenPathIsSameOrAhead = tokenPathIsSameOrAhead || `basis.${path}` === this.path;
        return !tokenPathIsSameOrAhead;
      }
      return false;
    };
    // Build options for referencing basis tokens
    // TODO: only do this once and cache it, ideally in lib/Theme or its context provider,
    // rather than on every field instance.
    this.#options =
      basisTokens && typeof basisTokens !== 'string'
        ? Object.entries(Theme.flatten(basisTokens))
            .filter(filterByTypeAndPosition)
            .map(([path, { $type, ...token }]) => {
              // Find the resolved value for color tokens to show in the combobox options.
              // Since tokens can reference other tokens, we check if the token is a reference and use the resolved value if so.
              const resolved = isRef(token.$value) ? token['$extensions']?.[EXTENSION_RESOLVED_AS] : token.$value;
              const $value = `{basis.${path}}`;
              const $extensions = {
                ...token['$extensions'],
                [EXTENSION_RESOLVED_AS]: structuredClone(resolved),
              };
              return {
                label: $value.slice(1, -1),
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
    return this.pathErrors.length > 0 || this.#hasNestedErrors;
  }

  get #hasNestedErrors(): boolean {
    if (!this.path) {
      return this.errors.length > 0;
    }

    return this.errors.some((error) => error.path.startsWith(this.path + '.'));
  }

  protected get pathErrors(): ValidationIssue[] {
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
      case 'number':
      case 'lineHeight':
        return 'number';
      case 'fontFamily':
      case 'fontFamilies':
        return 'font-family';
      default:
        return undefined;
    }
  }

  get value() {
    return this.token?.$value;
  }

  renderField(type: NonNullable<typeof this.type>, label: string) {
    // TODO: better a11y for combobox, move label and errors into the combobox itself rather than relying on visual proximity.
    return html`<p>${label}</p>
      ${this.pathErrors.map(
        (error) =>
          html`<div class="utrecht-form-field-error-message" id=${error.id}>
            ${t(`validation.error.${error.code}.compact`, error)}
          </div>`,
      )}
      <wizard-token-combobox
        name=${this.path}
        hidden-label=${label}
        type=${type}
        .value=${this.token}
        .options=${this.options}
        class=${classMap({ 'theme-error': this.#hasErrors })}
      ></wizard-token-combobox>`;
  }

  override render() {
    if (this.depth > WizardTokenField.maxDepth) return nothing;
    const type = this.type;
    const label = this.label || `${this.path.split('.').at(-1)}`;

    return html`
      <div
        class="wizard-token-field ${classMap({ 'wizard-token-field--invalid': this.#hasErrors && type !== undefined })}"
      >
        ${type
          ? this.renderField(type, label)
          : html`<utrecht-paragraph class=${classMap({ 'theme-error': this.#hasErrors })}>${label}</utrecht-paragraph>
              <ul>
                ${this.entries.map(([key]) => {
                  const path = `${this.path}.${key}`;
                  const depth = this.depth + 1;
                  return html`
                    <li key=${key}>
                      <wizard-token-field
                        .errors=${this.#getChildPathErrors(path)}
                        path=${path}
                        depth=${depth}
                      ></wizard-token-field>
                    </li>
                  `;
                })}
              </ul>`}
      </div>
    `;
  }

  static entries(token: Token) {
    return Object.entries(token).filter((entry): entry is [string, Token] => !entry[0].startsWith('$'));
  }
}
