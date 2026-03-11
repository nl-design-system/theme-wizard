import { consume } from '@lit/context';
import codeStyles from '@nl-design-system-candidate/code-css/code.css?inline';
import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/css-scraper';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { html, LitElement, unsafeCSS } from 'lit';
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
  static override readonly styles = [styles, unsafeCSS(codeStyles), unsafeCSS(tableCss)];

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

  readonly #renderSample = (type: StagedDesignToken['$type'], value: string) => {
    switch (type) {
      case 'color': {
        return html`<wizard-color-sample color=${value}></wizard-color-sample>`;
      }
      case 'dimension': {
        return html`<wizard-font-sample size=${value}></wizard-font-sample>`;
      }
      case 'fontFamily':
      default: {
        return html`<wizard-font-sample family=${value} size="var(--basis-text-font-size-xl)"></wizard-font-sample>`;
      }
    }
  };

  override render() {
    const sortedTokens = this.scrapedTokens.toSorted((a, b) => {
      if (a.$type === 'fontFamily' && b.$type === 'fontFamily') {
        return a.$extensions[EXTENSION_AUTHORED_AS].localeCompare(b.$extensions[EXTENSION_AUTHORED_AS]);
      }
      if (a.$type === 'dimension' && b.$type === 'dimension') {
        const normalizedA = dimensionToPx(a.$value);
        const normalizedB = dimensionToPx(b.$value);
        return normalizedB.value - normalizedA.value;
      }

      // No need to sort colors because that already happened during scraping on the server
      // https://github.com/projectwallace/css-design-tokens handles this

      // Group tokens by type
      return b.$type.localeCompare(a.$type);
    });

    return html`
      <div class="wizard-scraped-tokens-preview">
        <table class="utrecht-table">
          <caption class="utrecht-table__caption">
            ${t(`stagedTokens.title`)}
          </caption>
          <thead class="utrecht-table__header">
            <tr class="utrecht-table__row">
              <th class="utrecht-table__header-cell">${t('stagedTokens.staged')}</th>
              <th class="utrecht-table__header-cell">${t('stagedTokens.preview')}</th>
              <th class="utrecht-table__header-cell">${t('stagedTokens.value')}</th>
              <th class="utrecht-table__header-cell">${t('stagedTokens.type')}</th>
              <th class="utrecht-table__header-cell">${t('stagedTokens.count')}</th>
            </tr>
          </thead>
          <tbody class="utrecht-table__body" @change=${this.#handleChange}>
            ${sortedTokens.map(
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
                  <td class="utrecht-table__cell">
                    ${this.#renderSample(token.$type, token.$extensions[EXTENSION_AUTHORED_AS])}
                  </td>
                  <td class="utrecht-table__cell">
                    <code class="nl-code">${token.$extensions[EXTENSION_AUTHORED_AS]}</code>
                  </td>
                  <td class="utrecht-table__cell">${token.$type === 'dimension' ? 'font-size' : token.$type}</td>
                  <td class="utrecht-table__cell">${token.$extensions[EXTENSION_USAGE_COUNT]}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
