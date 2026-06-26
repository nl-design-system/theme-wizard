import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import '@nl-design-system-community/clippy-components/clippy-card-radio-group';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { BaseDesignToken, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import ChevronDown from '@tabler/icons/outline/chevron-down.svg?raw';
import { dequal } from 'dequal';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import Theme from '../../lib/Theme';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
import { EXTENSION_TOKEN_STAGED, type StagedDesignToken } from '../../utils/types';
import { markStepComplete } from '../../utils/wizard-steps-storage';
import styles from './styles';
import '../wizard-color-description';

export { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
export type { SubmitSaveTokenFormEvent } from '../../utils/events';

function tokenEquals(a: StagedDesignToken, b: BaseDesignToken): boolean {
  return dequal(a.$value, b.$value) && a.$type === b.$type;
}

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

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(event.target);

    const tokens: UpdateDesignTokensDetail = Array.from(formData.entries()).flatMap(([path, value]) => {
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

    location.assign(this.returnUrl);
  }

  get tokenAt() {
    return this.theme.at(this.path) as BaseDesignToken | undefined;
  }

  get type() {
    return this.tokenAt?.$type;
  }

  get tokens() {
    return this.scrapedTokens
      .filter((token) => token.$extensions?.[EXTENSION_TOKEN_STAGED] === true)
      .filter((token) => token.$type === this.tokenAt?.$type)
      .filter((token) => {
        const subType = this.subType;
        if (!subType) {
          return true;
        }
        const properties = token.$extensions?.['nl.nldesignsystem.theme-wizard.css-properties'];
        if (!Array.isArray(properties)) {
          return true;
        }
        return properties.includes(subType);
      })
      .sort(
        (a, b) =>
          b.$extensions?.['nl.nldesignsystem.theme-wizard.usage-count'] -
          a.$extensions?.['nl.nldesignsystem.theme-wizard.usage-count'],
      );
  }

  private renderSample(token: BaseDesignToken) {
    const tokenType = this.tokenAt!.$type;
    const stringified = stringifyToken(token);

    if (this.path.includes('heading')) {
      return html`
        <div class="sample">
          <clippy-html-image>
            <clippy-heading
              style=${styleMap({
                '--nl-heading-level-2-color': tokenType === 'color' ? stringified : undefined,
                '--nl-heading-level-2-font-family': tokenType === 'fontFamily' ? stringified : undefined,
              })}
              level="2"
            >
              Voorbeeld van een koptekst.
            </clippy-heading>
            <wizard-font-sample>
              Voorbeeld van een tekst. Op brute wijze ving de schooljuf de quasi-kalme lynx.
            </wizard-font-sample>
          </clippy-html-image>
        </div>
      `;
    }

    if (this.path.includes('action-1.bg-default')) {
      return html`
        <div class="sample">
          <clippy-html-image
            style=${styleMap({
              '--nl-button-primary-background-color': tokenType === 'color' ? stringified : undefined,
              '--nl-button-primary-color':
                tokenType === 'color'
                  ? `color-mix(in hsl, contrast-color(${stringified}) 95%, ${stringified})`
                  : undefined,
            })}
          >
            <clippy-button purpose="primary">Voorbeeld van knop</clippy-button>
          </clippy-html-image>
        </div>
      `;
    }

    return html`
      <div class="sample">
        <wizard-font-sample
          wrap
          family=${tokenType === 'fontFamily' ? stringified : undefined}
          color=${tokenType === 'color' ? stringified : undefined}
        >
          Voorbeeld van een tekst. Op brute wijze ving de schooljuf de quasi-kalme lynx.
        </wizard-font-sample>
      </div>
    `;
  }

  override render() {
    const path = this.path;
    const tokenAt = this.tokenAt;
    const itemsToShow =
      this.showAll || this.tokens.length < WizardStepForm.defaultItemsToShow
        ? Infinity
        : WizardStepForm.defaultItemsToShow;

    if (!tokenAt) {
      // TODO: better messaging
      return html`ERR: no token at ${this.path}`;
    }

    const tokenType = tokenAt.$type;

    if (this.tokens.length === 0) {
      return html`<p class="nl-paragraph">Geen aanbevelingen om te tonen.</p>`;
    }

    const checkedIndex = this.tokens.findIndex((t) => tokenEquals(t, tokenAt));

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <wizard-stack size="4xl">
          <fieldset>
            <wizard-stack size="xl">
              <legend>Gevonden waardes op website</legend>

              <clippy-card-radio-group name=${path} value=${checkedIndex >= 0 ? String(checkedIndex) : ''}>
                ${this.tokens.slice(0, itemsToShow).map((token, index) => {
                  const stringified = stringifyToken(token);
                  return html`
                    <clippy-card-radio-option value=${String(index)}>
                      ${token.$type === 'color'
                        ? html`<clippy-color-sample slot="start" color=${stringified}></clippy-color-sample>`
                        : nothing}
                      ${token.$type === 'fontFamily'
                        ? html`
                            <div class="sample" slot="start">
                              <clippy-reset-theme>
                                <wizard-preview-theme>
                                  <wizard-font-sample size="var(--basis-text-font-size-lg)" family=${stringified}
                                    >Ag</wizard-font-sample
                                  >
                                </wizard-preview-theme>
                              </clippy-reset-theme>
                            </div>
                          `
                        : nothing}
                      ${stringified}
                      ${tokenType === 'color'
                        ? html`<wizard-color-description
                            color=${stringified}
                            slot="description"
                          ></wizard-color-description>`
                        : nothing}
                      <clippy-reset-theme slot="body">
                        <wizard-preview-theme>${this.renderSample(token)}</wizard-preview-theme>
                      </clippy-reset-theme>
                    </clippy-card-radio-option>
                  `;
                })}
              </clippy-card-radio-group>
              ${itemsToShow === Infinity
                ? nothing
                : html`
                    <clippy-button purpose="subtle" type="button" @click=${() => (this.showAll = true)}>
                      <span slot="iconStart">${unsafeSVG(ChevronDown)}</span>
                      Toon alle tokens
                    </clippy-button>
                  `}
            </wizard-stack>
          </fieldset>

          <div class="utrecht-action-group utrecht-action-group--row">
            <button class="nl-button nl-button--primary" type="submit">Opslaan</button>
            <a href=${this.returnUrl} class="nl-button nl-button--secondary">
              <span class="nl-button__label">Annuleren</span>
            </a>
          </div>
        </wizard-stack>
      </form>
    `;
  }
}
