import { consume } from '@lit/context';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { BaseDesignToken, stringifyToken } from '@nl-design-system-community/design-tokens-schema';
import '@nl-design-system-community/clippy-components/clippy-html-image';
import { dequal } from 'dequal';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import Theme from '../../lib/Theme';
import { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
import { EXTENSION_TOKEN_STAGED, type StagedDesignToken } from '../../utils/types';
import { markStepComplete } from '../../utils/wizard-steps-storage';
import styles from './styles';

export { UPDATE_DESIGN_TOKENS_EVENT, type UpdateDesignTokensDetail } from '../../utils/events';
export type { SubmitSaveTokenFormEvent } from '../../utils/events';

type StagedFontFamilyToken = StagedDesignToken & { $type: 'fontFamily'; $value: string[] };

function isStagedFontFamilyToken(token: StagedDesignToken): token is StagedFontFamilyToken {
  return token.$type === 'fontFamily' && Array.isArray(token.$value);
}

function tokenEquals(a: StagedDesignToken, b: BaseDesignToken): boolean {
  return dequal(a.$value, b.$value) && a.$type === b.$type;
}

const tag = 'wizard-step-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardStepForm;
  }
}

@customElement(tag)
export class WizardStepForm extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), unsafeCSS(paragraphCss), styles];

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

  private handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(event.target);

    const tokens: UpdateDesignTokensDetail = Array.from(formData.entries()).flatMap(([path, value]) => {
      const token = this.tokens[Number(value)];
      return {
        path,
        value: token.$value,
      };
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
    const token = this.theme.at(this.path) as BaseDesignToken | undefined;
    return token;
  }

  get type() {
    return this.tokenAt?.$type;
  }

  get tokens() {
    return this.scrapedTokens
      .filter((token) => token.$extensions?.[EXTENSION_TOKEN_STAGED] === true)
      .filter((token) => token.$type === this.tokenAt?.$type)
      .sort(
        (a, b) =>
          b.$extensions?.['nl.nldesignsystem.theme-wizard.usage-count'] -
          a.$extensions?.['nl.nldesignsystem.theme-wizard.usage-count'],
      );
  }

  override render() {
    const path = this.path;
    const tokenAt = this.tokenAt;

    if (!tokenAt) {
      return html`ERR: no token at ${this.path}`;
    }

    if (this.tokens.length === 0) {
      return html`<p class="nl-paragraph">Geen aanbevelingen om te tonen.</p>`;
    }

    return html`
      <form method="POST" @submit=${this.handleSubmit}>
        <wizard-stack size="2xl">
          <fieldset>
            <wizard-stack size="xl">
              <legend>Gevonden waardes op website</legend>

              ${this.tokens.map((token, index) => {
                return html`
                  <div class="wizard-card-as-input">
                    <input
                      type="radio"
                      name=${path}
                      value=${index}
                      id=${index}
                      ?checked=${tokenEquals(token, tokenAt)}
                    />
                    <label for=${index}>${stringifyToken(token)}</label>
                    <wizard-font-sample wrap family=${stringifyToken(token)}></wizard-font-sample>
                  </div>
                `;
              })}
            </wizard-stack>
          </fieldset>

          <div class="utrecht-action-group utrecht-action-group--row">
            <button class="nl-button nl-button--primary" type="submit">Opslaan</button>
            <a href="./" class="nl-button nl-button--secondary">
              <span class="nl-button__label">Annuleren</span>
            </a>
          </div>
        </wizard-stack>
      </form>
    `;
  }
}
