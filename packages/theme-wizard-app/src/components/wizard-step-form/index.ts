import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import '@nl-design-system-community/clippy-components/clippy-stack';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import {
  BaseDesignToken,
  ColorValue,
  compareContrast,
  isColorToken,
  stringifyColor,
  stringifyToken,
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
import { generateScale, profileForName, TOKENS, type TokenName } from '../../lib/color-scale-generator';
import { getRelevantTokens, type RelevantTokensResult } from '../../lib/relevant-tokens';
import Theme from '../../lib/Theme';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
import { type StagedDesignToken } from '../../utils/types';
import { markStepComplete } from '../../utils/wizard-steps-storage';
import '../wizard-color-description';
import { EXTENSION_COLORSCALE_SEED } from '../wizard-colorscale-input';
import styles from './styles';

export { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
export type { SubmitSaveTokenFormEvent } from '../../utils/events';

const tokenEquals = (a: BaseDesignToken, b: BaseDesignToken): boolean => {
  return dequal(a.$value, b.$value) && a.$type === b.$type;
};

const INVERSE_SUFFIX = '-inverse';

interface ColorScaleParams {
  /** e.g. `basis.color.accent-1` */
  regularGroupPath: string;
  /** e.g. `basis.color.accent-1-inverse` */
  inverseGroupPath: string;
  profile: ReturnType<typeof profileForName>;
  /** Anchor for generating the regular scale. */
  regularAnchor: TokenName | undefined;
  /** Anchor for generating the inverse scale. */
  inverseAnchor: TokenName | undefined;
}

/** Qualifies only when path's last segment is one of the 14 canonical slot names. */
const getColorScaleParams = (path: string): ColorScaleParams | undefined => {
  const segments = path.split('.');
  const slot = segments.at(-1);
  const group = segments.at(-2);

  if (!slot || !group || !TOKENS.includes(slot as TokenName)) {
    return undefined;
  }

  const prefix = segments.slice(0, -2);
  const isInverse = group.endsWith(INVERSE_SUFFIX);
  const groupBase = isInverse ? group.slice(0, -INVERSE_SUFFIX.length) : group;
  const profile = profileForName(groupBase);

  // Anchor both scales to the picked slot so the seed reproduces exactly there.
  // Exception: picking the inverse group's bg-default (a vivid fill) shouldn't force
  // that color onto regular's bg-default (a pale background) — leave regular
  // unanchored there instead. Neutral's template can't anchor at all.
  let regularAnchor: TokenName | undefined;
  if (profile !== 'neutral') {
    regularAnchor = isInverse && slot === 'bg-default' ? undefined : (slot as TokenName);
  }
  const inverseAnchor = profile === 'neutral' ? undefined : (slot as TokenName);

  return {
    inverseAnchor,
    inverseGroupPath: [...prefix, `${groupBase}${INVERSE_SUFFIX}`].join('.'),
    profile,
    regularAnchor,
    regularGroupPath: [...prefix, groupBase].join('.'),
  };
};

const tag = 'wizard-step-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepForm;
  }
}

@safeCustomElement(tag)
export class WizardStepForm extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), unsafeCSS(linkCss), unsafeCSS(paragraphCss), styles];

  private static readonly defaultItemsToShow = 8;

  @consume({ context: themeContext, subscribe: true })
  @property({ attribute: false })
  private readonly theme!: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  private readonly scrapedTokens!: StagedDesignToken[];

  @property({ type: String })
  returnUrl: string = '';

  @property({ type: String })
  path: string = '';

  @property({ type: String })
  subType: string = '';

  @state()
  showAll: boolean = false;

  private _tokens: BaseDesignToken[] = [];
  // Store the origin of the selected so we can swap the headin text accordingly
  private _suggestedTokensSource: RelevantTokensResult['source'] = 'scraper';

  /**
   * Updating this._tokens here so we don't re-compute this array for each sub-render in this element
   */
  override willUpdate(changed: PropertyValues) {
    if (changed.has('scrapedTokens') || changed.has('path') || changed.has('subType') || changed.has('theme')) {
      const requestedType = this.tokenAt?.$type;

      if (!requestedType) {
        return;
      }

      const { source, tokens } = getRelevantTokens(this.theme, this.scrapedTokens, requestedType, this.subType);

      if (this.type === 'color' && this.path === 'basis.color.default.color-default') {
        const bgDocument = this.theme.at('basis.color.default.bg-default').$value;
        tokens.sort((a, b) => {
          return (
            compareContrast(b.$value as ColorValue, bgDocument) - compareContrast(a.$value as ColorValue, bgDocument)
          );
        });
      }

      this._tokens = tokens;
      this._suggestedTokensSource = source;

      // Reveal the full list up front when the checked option (e.g. a color-scale's seed match)
      // would otherwise be hidden behind the default show-more cutoff.
      if (this.tokenAt && this.getCheckedIndex(tokens, this.tokenAt, this.path) >= WizardStepForm.defaultItemsToShow) {
        this.showAll = true;
      }
    }
  }

  /** Index of the option matching the current value, or the group's color-scale seed. */
  private getCheckedIndex(tokens: BaseDesignToken[], tokenAt: BaseDesignToken, path: string): number {
    if (!isColorToken(tokenAt)) {
      return tokens.findIndex((token) => tokenEquals(token, tokenAt));
    }

    const scaleParams = getColorScaleParams(path);
    const seedColor = scaleParams
      ? (this.theme.at(scaleParams.regularGroupPath) as BaseDesignToken | undefined)?.$extensions?.[
          EXTENSION_COLORSCALE_SEED
        ]
      : undefined;

    return tokens.findIndex((token) => {
      if (tokenEquals(token, tokenAt)) {
        return true;
      }
      if (seedColor !== undefined && dequal(token.$value, seedColor)) {
        return true;
      }
      return false;
    });
  }

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(event.target);

    // Keep submitted paths separate from the possibly-expanded token list below (for markStepComplete).
    const selections = Array.from(formData.entries()).flatMap(([path, value]) => {
      if (typeof value !== 'string' || value === '') {
        return [];
      }
      const token = this.tokens[Number(value)];
      if (!token) {
        return [];
      }
      return [{ path, token }];
    });

    // A color-scale slot path expands into its whole 14-token ramp (regular + paired inverse group),
    // and records the picked color as both groups' seed so it can reproduce exactly there later.
    const groupSeeds: NonNullable<UpdateDesignTokensDetail['groupSeeds']> = [];
    const tokens: UpdateDesignTokensDetail['tokens'] = selections.flatMap(({ path, token }) => {
      if (!isColorToken(token)) {
        return [{ path, value: token.$value }];
      }

      const scaleParams = getColorScaleParams(path);
      if (!scaleParams) {
        return [{ path, value: token.$value }];
      }

      const { inverseAnchor, inverseGroupPath, profile, regularAnchor, regularGroupPath } = scaleParams;
      const seed = stringifyColor(token.$value);
      const regular = generateScale(seed, { anchor: regularAnchor, contrast: { enforce: true }, profile }).data;
      const inverse = generateScale(seed, {
        anchor: inverseAnchor,
        inverse: true,
        profile,
      }).data;

      groupSeeds.push(
        { groupPath: regularGroupPath, seed: token.$value },
        { groupPath: inverseGroupPath, seed: token.$value },
      );

      return TOKENS.flatMap((tokenName) => [
        { path: `${regularGroupPath}.${tokenName}`, value: regular[tokenName] },
        { path: `${inverseGroupPath}.${tokenName}`, value: inverse[tokenName] },
      ]);
    });

    // Emit custom event that lets Theme do updateMany()
    event.target.dispatchEvent(
      new CustomEvent<UpdateDesignTokensDetail>(UPDATE_DESIGN_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail: { groupSeeds, tokens },
      }),
    );

    for (const { path } of selections) {
      markStepComplete(path);
    }

    // Redirect after submission
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

    if (this.path.includes('.action-1-inverse') && isColorToken(token)) {
      const exampleScale = generateScale(stringified, {
        anchor: 'bg-default',
        inverse: true,
        profile: 'accent',
      }).data;
      const style = {
        '--nl-button-primary-background-color': stringifyColor(exampleScale['bg-default']),
        '--nl-button-primary-border-color': stringifyColor(exampleScale['border-default']),
        '--nl-button-primary-color': stringifyColor(exampleScale['color-default']),
      };

      return html`
        <clippy-html-image>
          <clippy-reset-theme>
            <wizard-preview-theme>
              <clippy-button purpose="primary" style=${styleMap(style)}>Klik mij!</clippy-button>
            </wizard-preview-theme>
          </clippy-reset-theme>
        </clippy-html-image>
      `;
    }

    if (this.path.includes('.action-2') && isColorToken(token)) {
      const exampleScale = generateScale(stringified, {
        profile: 'accent',
      }).data;
      const style = {
        '--nl-link-color': stringifyColor(exampleScale['color-default']),
        '--nl-link-text-decoration-color': stringifyColor(exampleScale['color-default']),
      };

      return html`
        <clippy-html-image>
          <clippy-reset-theme>
            <wizard-preview-theme>
              <p class="nl-paragraph">
                Voorbeeldtekst met
                <a href="" class="nl-link" style=${styleMap(style)}>een link</a>
                die je kunt aanklikken.
              </p>
            </wizard-preview-theme>
          </clippy-reset-theme>
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
    return html`
      <clippy-card-radio-option value=${String(index)}>
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
      </clippy-card-radio-option>
    `;
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
    const checkedIndex = this.getCheckedIndex(tokens, tokenAt, path);

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
