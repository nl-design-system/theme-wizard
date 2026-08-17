import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import '@nl-design-system-community/clippy-components/clippy-stack';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import { EXTENSION_CSS_PROPERTIES, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import {
  BaseDesignToken,
  isColorToken,
  isRef,
  stringifyToken,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';
import ChevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import ChevronUp from '@tabler/icons/outline/chevron-up.svg?raw';
import { dequal } from 'dequal';
import { LitElement, PropertyValues, html, nothing, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import Theme from '../../lib/Theme';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
import { EXTENSION_TOKEN_STAGED, type StagedDesignToken } from '../../utils/types';
import { markStepComplete } from '../../utils/wizard-steps-storage';
import '../wizard-color-description';
import styles from './styles';

export { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
export type { SubmitSaveTokenFormEvent } from '../../utils/events';

const tokenEquals = (a: BaseDesignToken, b: BaseDesignToken): boolean => {
  return dequal(a.$value, b.$value) && a.$type === b.$type;
};

const tag = 'wizard-step-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepForm;
  }
}

@safeCustomElement(tag)
export class WizardStepForm extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), unsafeCSS(paragraphCss), styles];

  private static readonly defaultItemsToShow = 8;

  @consume({ context: themeContext, subscribe: true })
  @property({ attribute: false })
  private readonly theme!: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  scrapedTokens: StagedDesignToken[] = [];

  @property({ type: String })
  returnUrl: string = '';

  @property({ type: String })
  path: string = '';

  @property({ type: String })
  subType: string = '';

  @state()
  showAll: boolean = false;

  private _tokens: BaseDesignToken[] = [];
  private _suggestedTokensSource: 'scraper' | 'theme' = 'scraper';

  #getRelevantStagedTokens(requestedType: string, requestedSubType: string): BaseDesignToken[] {
    // First filter staged tokens by type
    const stagedTypeTokens = this.scrapedTokens.filter((token) => {
      if (token.$extensions?.[EXTENSION_TOKEN_STAGED] !== true) {
        return false;
      }
      if (token.$type !== requestedType) {
        return false;
      }
      return true;
    });

    // Then filter by subType if requested
    const stagedSubTypeTokens = stagedTypeTokens.filter((token) => {
      if (!requestedSubType) {
        return true;
      }
      const cssProperties = token.$extensions?.[EXTENSION_CSS_PROPERTIES];
      return !Array.isArray(cssProperties) || cssProperties.includes(requestedSubType);
    });

    // If no tokens were found for the subType, fall back to the original type tokens
    const filteredTokens = stagedSubTypeTokens.length > 0 ? stagedSubTypeTokens : stagedTypeTokens;

    return filteredTokens.toSorted(
      (a, b) => (b.$extensions?.[EXTENSION_USAGE_COUNT] || 0) - (a.$extensions?.[EXTENSION_USAGE_COUNT] || 0),
    );
  }

  #getRelevantThemeTokens(requestedType: string, requestedSubType: string): BaseDesignToken[] {
    // Storing tokens in a Map so we get guaranteed unique values
    const typeTokens: Map<string, BaseDesignToken> = new Map();

    walkTokens(this.theme.tokens, (token) => {
      if (
        token.$type === requestedType &&
        !isRef(token.$value) &&
        // Scraper filters out transparent colors, but theme.tokens may still contain them
        !(isColorToken(token) && token.$value.alpha !== undefined && token.$value.alpha < 1)
      ) {
        typeTokens.set(stringifyToken(token), token);
      }
    });

    const tokens = Array.from(typeTokens.values());
    const subTypeTokens = tokens.filter((token) => {
      if (!requestedSubType) {
        return true;
      }
      const cssProperties = token.$extensions?.[EXTENSION_CSS_PROPERTIES];
      return !Array.isArray(cssProperties) || cssProperties.includes(requestedSubType);
    });

    return subTypeTokens.length > 0 ? subTypeTokens : tokens;
  }

  /**
   * Updating this._tokens here so we don't re-compute this array for each sub-render in this element
   */
  override willUpdate(changed: PropertyValues) {
    if (changed.has('scrapedTokens') || changed.has('path') || changed.has('subType') || changed.has('theme')) {
      const requestedType = this.tokenAt?.$type;

      if (!requestedType) {
        return;
      }

      const requestedSubType = this.subType;

      // Store the sorted tokens and the source of the tokens so we know which title to show on top of the list
      const relevantStagedTokens = this.#getRelevantStagedTokens(requestedType, requestedSubType);
      if (relevantStagedTokens.length > 0) {
        this._suggestedTokensSource = 'scraper';
        this._tokens = relevantStagedTokens;
      } else {
        this._suggestedTokensSource = 'theme';
        this._tokens = this.#getRelevantThemeTokens(requestedType, requestedSubType);
      }
    }
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(event.target);

    // Make a list of path+token based on what's inside FormData
    const tokens: UpdateDesignTokensDetail = Array.from(formData.entries()).flatMap(([path, value]) => {
      if (typeof value !== 'string' || value === '') {
        return [];
      }
      const token = this.tokens[Number(value)];
      if (!token) {
        return [];
      }
      return [{ path, value: token.$value }];
    });

    // Emit custom event that lets Theme do updateMany()
    event.target.dispatchEvent(
      new CustomEvent<UpdateDesignTokensDetail>(UPDATE_DESIGN_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail: tokens,
      }),
    );

    for (const { path } of tokens) {
      markStepComplete(path);
    }

    if (this.returnUrl) {
      location.assign(this.returnUrl);
    }
  }

  get tokenAt() {
    return this.theme.at(this.path) as BaseDesignToken | undefined;
  }

  get type() {
    return this.tokenAt?.$type;
  }

  get tokens() {
    return this._tokens;
  }

  private renderSample(token: BaseDesignToken) {
    const tokenType = this.tokenAt!.$type;
    const stringified = stringifyToken(token);

    if (this.path.includes('heading')) {
      const color = tokenType === 'color' ? stringified : undefined;
      const fontFamily = tokenType === 'fontFamily' ? stringified : undefined;
      return html`
        <clippy-html-image>
          <clippy-heading
            style=${styleMap({
              '--nl-heading-level-2-color': color,
              '--nl-heading-level-2-font-family': fontFamily,
            })}
            level="2"
          >
            ${t('wizard.stepForm.sample.heading')}
          </clippy-heading>
        </clippy-html-image>
        <clippy-token-sample-text>${t('wizard.stepForm.sample.paragraph')}</clippy-token-sample-text>
      `;
    }

    if (this.path.includes('action-1.bg-default') && tokenType === 'color') {
      const color =
        token.$type === 'color' ? `color-mix(in hsl, contrast-color(${stringified}) 95%, ${stringified})` : undefined;
      return html`
        <clippy-html-image
          style=${styleMap({
            '--nl-button-primary-background-color': stringified,
            '--nl-button-primary-color': color,
          })}
        >
          <clippy-button purpose="primary">${t('wizard.stepForm.sample.button')}</clippy-button>
        </clippy-html-image>
      `;
    }

    return html`
      <clippy-token-sample-text
        font-family=${tokenType === 'fontFamily' ? stringified : undefined}
        color=${tokenType === 'color' ? stringified : undefined}
      >
        ${t('wizard.stepForm.sample.paragraph')}
      </clippy-token-sample-text>
    `;
  }

  private renderIconStart(tokenType: string, value: string) {
    if (tokenType === 'color') {
      return html`<clippy-color-sample slot="start" color=${value}></clippy-color-sample>`;
    }

    if (tokenType === 'fontFamily') {
      return html`
        <div class="wizard-step-form__sample wizard-step-form__sample-start" slot="start">
          <clippy-reset-theme>
            <wizard-preview-theme>
              <clippy-token-sample-text font-size="var(--basis-text-font-size-lg)" font-family=${value}
                >Ag</clippy-token-sample-text
              >
            </wizard-preview-theme>
          </clippy-reset-theme>
        </div>
      `;
    }
    return nothing;
  }

  private renderRadioCardOption(token: BaseDesignToken, index: number, tokenType: BaseDesignToken['$type']) {
    const stringified = stringifyToken(token);
    return html` <clippy-card-radio-option value=${String(index)}>
      ${this.renderIconStart(tokenType, stringified)} ${stringified}
      ${
        tokenType === 'color'
          ? html`<wizard-color-description color=${stringified} slot="description"></wizard-color-description>`
          : nothing
      }
      <clippy-reset-theme slot="body">
        <wizard-preview-theme>
          <div class="wizard-step-form__sample wizard-step-form__sample-body">${this.renderSample(token)}</div>
        </wizard-preview-theme>
      </clippy-reset-theme>
    </clippy-card-radio-option>`;
  }

  private renderShowMoreButton() {
    const tokenCount = this.tokens.length;
    if (tokenCount <= WizardStepForm.defaultItemsToShow) {
      return nothing;
    }
    const showLess = this.showAll && tokenCount >= WizardStepForm.defaultItemsToShow;
    const showMoreButtonText = showLess
      ? t('wizard.stepForm.showFewerTokens')
      : t('wizard.stepForm.showMoreTokens', {
          tokenCount: tokenCount - WizardStepForm.defaultItemsToShow,
        });
    const showMoreButtonIcon = showLess ? ChevronUp : ChevronDown;
    return html`
      <clippy-button purpose="subtle" type="button" @click=${() => (this.showAll = !this.showAll)}>
        <span slot="iconStart">${unsafeSVG(showMoreButtonIcon)}</span>
        ${showMoreButtonText}
      </clippy-button>
    `;
  }

  override render() {
    const { path, tokenAt, tokens } = this;
    const tokenCount = tokens.length;

    if (!tokenAt) {
      return html`${t('wizard.stepForm.errorNoToken', { path: this.path })}`;
    }

    if (tokenCount === 0) {
      return html`<p class="nl-paragraph">${t('wizard.stepForm.noRecommendations')}</p>`;
    }

    const tokenType = tokenAt.$type;
    const tokenCountToShow =
      !this.showAll || tokens.length < WizardStepForm.defaultItemsToShow ? WizardStepForm.defaultItemsToShow : Infinity;
    const checkedIndex: number | undefined = tokens.findIndex((token) => tokenEquals(token, tokenAt));

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <clippy-stack size="4xl">
          <fieldset class="wizard-step-form__fieldset">
            <clippy-stack size="xl">
              <legend class="wizard-step-form__legend">
                ${this._suggestedTokensSource === 'scraper' ? t('wizard.stepForm.foundScrapedValues') : t('wizard.stepForm.foundThemeValues')}
              </legend>

              <clippy-card-radio-group name=${path} value=${checkedIndex >= 0 ? String(checkedIndex) : ''}>
                ${tokens.slice(0, tokenCountToShow).map((token, index) => {
                  return this.renderRadioCardOption(token, index, tokenType);
                })}
              </clippy-card-radio-group>

              ${this.renderShowMoreButton()}
            </clippy-stack>
          </fieldset>

          <div class="utrecht-action-group utrecht-action-group--row">
            <button class="nl-button nl-button--primary" type="submit">${t('save')}</button>
            <a href=${this.returnUrl || nothing} class="nl-button nl-button--secondary">
              <span class="nl-button__label">${t('cancel')}</span>
            </a>
          </div>
        </clippy-stack>
      </form>
    `;
  }
}
