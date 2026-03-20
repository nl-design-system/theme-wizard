import { consume } from '@lit/context';
import codeStyles from '@nl-design-system-candidate/code-css/code.css?inline';
import srOnlyStyles from '@nl-design-system-community/clippy-components/lib/sr-only';
import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/css-scraper';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { html, LitElement, TemplateResult, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { t } from '../../i18n';
import PersistentStorage from '../../lib/PersistentStorage';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils';
import { dimensionToPx } from '../../utils/token-utils';
import styles from './styles';

const tag = 'wizard-scraped-tokens-preview';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScrapedTokensPreview;
  }
}

@customElement(tag)
export class WizardScrapedTokensPreview extends LitElement {
  static override readonly styles = [styles, unsafeCSS(codeStyles), unsafeCSS(tableCss), unsafeCSS(srOnlyStyles)];

  // TODO: this shouldn't use storage directly but talk to this.scrapedTokens
  readonly #scrapedTokensStorage = new PersistentStorage({ prefix: 'scraped-tokens' });

  @consume({ context: scrapedTokensContext, subscribe: true })
  scrapedTokens: StagedDesignToken[] = [];

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const isStaged = Boolean(target.checked);

    // TODO: this shouldn't write to storage directly but call enable/disable on a tokenStore
    this.#scrapedTokensStorage.setJSON(
      this.scrapedTokens.map((token) => {
        if (token.$extensions[EXTENSION_TOKEN_ID] === target.id) {
          token.$extensions[EXTENSION_TOKEN_STAGED] = isStaged;
        }
        return token;
      }),
    );
  };

  readonly #renderTable = (
    caption: string | TemplateResult,
    tokens: StagedDesignToken[],
    renderSample: (token: StagedDesignToken) => TemplateResult,
  ) => html`
    <wizard-table-scroller>
      <table class="utrecht-table">
        <caption class="utrecht-table__caption">
          ${caption}
        </caption>
        <thead class="utrecht-table__header">
          <tr class="utrecht-table__row">
            <th class="utrecht-table__header-cell">${t('stagedTokens.staged')}</th>
            <th class="utrecht-table__header-cell">${t('stagedTokens.preview')}</th>
            <th class="utrecht-table__header-cell">${t('stagedTokens.value')}</th>
            <th class="utrecht-table__header-cell">${t('stagedTokens.count')}</th>
          </tr>
        </thead>
        <tbody class="utrecht-table__body" @change=${this.#handleChange}>
          ${tokens.map(
            (token) => html`
              <tr class="utrecht-table__row">
                <td class="utrecht-table__cell">
                  <input
                    type="checkbox"
                    name="enabled-tokens"
                    id=${token.$extensions[EXTENSION_TOKEN_ID]}
                    ?checked=${token.$extensions[EXTENSION_TOKEN_STAGED] === true}
                  />
                </td>
                <td class="utrecht-table__cell">${renderSample(token)}</td>
                <td class="utrecht-table__cell">
                  <code class="nl-code">${token.$extensions[EXTENSION_AUTHORED_AS]}</code>
                </td>
                <td class="utrecht-table__cell">${token.$extensions[EXTENSION_USAGE_COUNT]}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    </wizard-table-scroller>
  `;

  override render() {
    const families = this.scrapedTokens
      .filter((token) => token.$type === 'fontFamily')
      .toSorted((a, b) => {
        return a.$extensions[EXTENSION_AUTHORED_AS].localeCompare(b.$extensions[EXTENSION_AUTHORED_AS]);
      });
    const sizes = this.scrapedTokens
      .filter((token) => token.$type === 'dimension')
      .toSorted((a, b) => {
        const normalizedA = dimensionToPx(a.$value);
        const normalizedB = dimensionToPx(b.$value);
        return normalizedB.value - normalizedA.value;
      });
    const colors = this.scrapedTokens.filter((token) => token.$type === 'color');

    return html`
      <div class="wizard-scraped-tokens-preview">
        <wizard-stack size="5xl">
          ${this.#renderTable(
            t('tokens.types.fontFamilies'),
            families,
            (token) =>
              html`<wizard-font-sample
                family=${token.$extensions[EXTENSION_AUTHORED_AS]}
                size="var(--basis-text-font-size-xl)"
              ></wizard-font-sample>`,
          )}
          ${this.#renderTable(
            t('tokens.types.fontSizes'),
            sizes,
            (token) =>
              html`<wizard-font-sample size=${token.$extensions?.[EXTENSION_AUTHORED_AS]}></wizard-font-sample>`,
          )}
          ${this.#renderTable(
            t('tokens.types.colors'),
            colors,
            (token) =>
              html`<wizard-color-sample color=${token.$extensions[EXTENSION_AUTHORED_AS]}></wizard-color-sample>`,
          )}
        </wizard-stack>
      </div>
    `;
  }
}
