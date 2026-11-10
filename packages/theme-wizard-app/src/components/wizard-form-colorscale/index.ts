import '@nl-design-system-community/clippy-components/clippy-stack';
import { consume } from '@lit/context';
import { type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { stringifyToken, type BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, PropertyValues, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { getRelevantTokens } from '../../lib/relevant-tokens';
import { sortTokensForPath } from '../../lib/token-sort-strategies';
import { StagedDesignToken } from '../../utils';
import { hasChangedProperty } from '../../utils/lit';
import styles from './styles';

const tag = 'wizard-form-colorscale';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFormColorscale;
  }
}

@safeCustomElement(tag)
export class WizardFormColorscale extends LitElement {
  static override readonly styles = [styles];

  @state() private options: Option[] = [];

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  private readonly scrapedTokens!: StagedDesignToken[];

  @property({ type: String })
  returnUrl: string = '';

  @property({ type: String })
  path: string = '';

  @property() label: string = '';

  @property({ type: String })
  subType: string = '';

  private _tokens: BaseDesignToken[] = [];

  get tokenAt() {
    return this.theme.at(this.path) as BaseDesignToken | undefined;
  }

  get type() {
    return 'color';
  }

  get tokens() {
    return this._tokens;
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log('submit:', event);
  }

  #tokensToOptions = () => {
    this.options = this._tokens.map((token) => {
      const color = stringifyToken(token);
      return {
        description: 'TODO: description',
        label: color,
        value: token,
      };
    });
  };

  protected override willUpdate(changed: PropertyValues) {
    if (!hasChangedProperty(changed, ['scrapedTokens', 'path', 'subType', 'theme'])) {
      return;
    }

    const { tokens } = getRelevantTokens(this.theme, this.scrapedTokens, this.type, this.subType);

    this._tokens = sortTokensForPath(tokens, this.path, this.theme);

    this.#tokensToOptions();
  }

  // @TODO: fix
  get #hasErrors(): boolean {
    return false;
  }

  override render() {
    const { label, tokenAt, tokens } = this;
    const tokenCount = tokens.length;

    if (!tokenAt) {
      return html`${t('wizard.stepForm.errorNoToken', { path: this.path })}`;
    }

    if (tokenCount === 0) {
      return html`<p class="nl-paragraph">${t('wizard.stepForm.noRecommendations')}</p>`;
    }

    const renderedLabel = this.label || this.path;

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <clippy-stack size="4xl">
          <mark>Wizard form colorscale: ${this.path}</mark>

          <clippy-token-combobox
            name=${this.path}
            hidden-label=${renderedLabel}
            type="color"
            .invalid=${this.#hasErrors}
            .value=${this.options[0].value}
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

          <div class="utrecht-action-group utrecht-action-group--row">
            <button class="nl-button nl-button--primary" type="submit">${t('save')}</button>
            <a href="#" class="nl-button nl-button--secondary">
              <span class="nl-button__label">${t('cancel')}</span>
            </a>
          </div>
        </clippy-stack>
      </form>
    `;
  }
}
