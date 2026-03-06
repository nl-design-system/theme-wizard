import { consume } from '@lit/context';
import codeStyles from '@nl-design-system-candidate/code-css/code.css?inline';
import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
} from '@nl-design-system-community/css-scraper';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { t } from '../../i18n';
import PersistentStorage from '../../lib/PersistentStorage';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils';
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

  readonly #scrapedTokensStorage = new PersistentStorage({
    prefix: 'scraped-tokens',
  });

  @consume({ context: scrapedTokensContext, subscribe: true })
  scrapedTokens: StagedDesignToken[] = [];

  readonly #handleChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const isStaged = Boolean(target.checked);
    console.log('writing JSON', isStaged);
    this.#scrapedTokensStorage.setJSON(
      this.scrapedTokens.map((token) => {
        if (token.$extensions[EXTENSION_TOKEN_ID] === target.id) {
          token.$extensions[EXTENSION_TOKEN_STAGED] = isStaged;
        }
        return token;
      }),
    );
  };

  override render() {
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
            ${this.scrapedTokens
              .toSorted((a, b) => b.$type.localeCompare(a.$type))
              .map(
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
                      ${token.$type === `color`
                        ? html`
                            <wizard-color-sample
                              color=${token.$extensions[EXTENSION_AUTHORED_AS]}
                            ></wizard-color-sample>
                          `
                        : nothing}
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
