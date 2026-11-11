import '@nl-design-system-community/clippy-components/clippy-stack';
import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { ClippyTokenCombobox, type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { generateScale, TOKENS } from '@nl-design-system-community/color-scale-generator';
import {
  type ColorToken as ColorTokenType,
  ColorValue,
  EXTENSION_COLORSCALE_SEED,
  getExtension,
  stringifyColor,
  stringifyToken,
  type BaseDesignToken,
} from '@nl-design-system-community/design-tokens-schema';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { getColorScaleParams, INVERSE_SUFFIX } from '../../lib/ColorScale';
import { getRelevantTokens } from '../../lib/relevant-tokens';
import { sortTokensForPath } from '../../lib/token-sort-strategies';
import { StagedDesignToken } from '../../utils';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
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
  static override readonly styles = [unsafeCSS(buttonCss), styles];

  @state() private options: Option[] = [];
  @state() private selectedColorValue: ColorTokenType['$value'] | undefined = undefined;

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
    if (!(event.target instanceof HTMLFormElement) || !this.selectedColorValue) {
      return;
    }

    // TODO: color-default for regular, bg-default for inverse?
    const scaleParams = getColorScaleParams(`${this.path}.color-default`);
    if (!scaleParams) {
      return;
    }

    const { profile, regularAnchor, regularGroupPath } = scaleParams;
    const seed = stringifyColor(this.selectedColorValue);
    const regular = generateScale(seed, { anchor: regularAnchor, contrast: { enforce: true }, profile }).data;

    // TODO: do something with inverse

    const detail = {
      groupSeeds: [
        {
          groupPath: regularGroupPath,
          seed,
        },
      ],
      tokens: TOKENS.flatMap((tokenName) => [{ path: `${regularGroupPath}.${tokenName}`, value: regular[tokenName] }]),
    };

    // Emit custom event that lets Theme do updateMany()
    event.target.dispatchEvent(
      new CustomEvent<UpdateDesignTokensDetail>(UPDATE_DESIGN_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
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

  get #seedColor(): ColorValue | undefined {
    const isInverse = this.path.endsWith(INVERSE_SUFFIX);
    const seedColor = getExtension(this.tokenAt, EXTENSION_COLORSCALE_SEED);
    const fallBackToken: BaseDesignToken = isInverse
      ? (this.tokenAt?.['bg-default'] as BaseDesignToken)
      : (this.tokenAt?.['color-default'] as BaseDesignToken);
    if (seedColor && typeof seedColor === 'object' && 'colorSpace' in seedColor) {
      return seedColor as ColorValue;
    } else {
      return fallBackToken.$value as ColorTokenType['$value'];
    }
  }

  protected override willUpdate(changed: PropertyValues) {
    if (!hasChangedProperty(changed, ['scrapedTokens', 'path', 'subType', 'theme'])) {
      return;
    }

    const { tokens } = getRelevantTokens(this.theme, this.scrapedTokens, this.type, this.subType);
    this._tokens = sortTokensForPath(tokens, this.path, this.theme);
    this.#tokensToOptions();
  }

  protected override firstUpdated() {
    // Get initial seed color
    const seedColor = this.#seedColor;
    if (seedColor) {
      this.selectedColorValue = seedColor;
    }
  }

  // @TODO: fix
  get #hasErrors(): boolean {
    return false;
  }

  #handleColorChange = (event: Event) => {
    const target = event.target;
    if (target instanceof ClippyTokenCombobox && target.value) {
      const rawSelectedToken = target.value;

      if (rawSelectedToken.$value === this.selectedColorValue) return;

      this.selectedColorValue = rawSelectedToken.$value;
      if (!this.isConnected) return;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  };

  override render() {
    const { label, tokenAt, tokens } = this;
    const tokenCount = tokens.length;

    if (!tokenAt) {
      return html`${t('wizard.stepForm.errorNoToken', { path: this.path })}`;
    }

    if (tokenCount === 0) {
      return html`<p class="nl-paragraph">${t('wizard.stepForm.noRecommendations')}</p>`;
    }

    const renderedLabel = label || this.path;

    const resolvedValueToken: ColorTokenType | undefined = this.selectedColorValue
      ? { $type: 'color', $value: this.selectedColorValue }
      : undefined;

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <clippy-stack size="4xl">
          <clippy-token-combobox
            name=${this.path}
            hidden-label=${renderedLabel}
            type="color"
            .invalid=${this.#hasErrors}
            .value=${resolvedValueToken}
            .options=${this.options}
            @change=${this.#handleColorChange}
          >
            <span slot="label" class="wizard-token-field__label">${renderedLabel}</span>
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
