import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type TokenCandidate,
  applyReusableTokens,
  stringifyToken,
  type Theme,
} from '@nl-design-system-community/design-tokens-schema';
import checkboxCss from '@utrecht/checkbox-css/dist/index.css?inline';
import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { t } from '../../i18n';
import '../wizard-stack';
import '../wizard-table-scroller';
import '../wizard-token-output';
import styles from './styles';

const tag = 'wizard-reuse-suggestions-table';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardReuseSuggestionsTable;
  }
}

@customElement(tag)
export class WizardReuseSuggestionsTable extends LitElement {
  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(buttonCss),
    unsafeCSS(checkboxCss),
    unsafeCSS(formFieldCss),
    unsafeCSS(formLabelCss),
    unsafeCSS(tableCss),
    styles,
  ];

  @property({ type: Array })
  suggestions: TokenCandidate[] = [];

  @property({ type: Object })
  tokens: Theme | null = null;

  @state()
  private updatedTokens: Theme | null = null;

  private readonly handleApplySuggestions = (event: SubmitEvent) => {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement) || !this.tokens) return;
    const data = new FormData(event.currentTarget);

    const checkedPaths = new Set(data.getAll('suggestion'));
    const stagedSuggestions = this.suggestions.filter((token) => checkedPaths.has(token.path.join('.')));

    this.updatedTokens = applyReusableTokens(this.tokens, stagedSuggestions);
  };

  override render() {
    if (this.suggestions.length === 0) {
      return html`<p>${t('tokenReuseForm.suggestions.notFound')}</p>`;
    }

    const updatedJson = this.updatedTokens ? JSON.stringify(this.updatedTokens, null, 2) : '';

    return html`
      <form @submit=${this.handleApplySuggestions}>
        <wizard-stack size="3xl">
          <div class="utrecht-form-field utrecht-form-field--text">
            <div class="utrecht-form-field__label">
              <label for="suggestions-table" class="utrecht-form-label">${t('tokenReuseForm.suggestions.label')}</label>
            </div>
            <wizard-table-scroller>
              <table class="utrecht-table" id="suggestions-table">
                <thead class="utrecht-table__header">
                  <tr class="utrecht-table__row">
                    <th class="utrecht-table__header-cell"></th>
                    <th class="utrecht-table__header-cell">
                      ${t('tokenReuseForm.suggestions.table.header.tokenPath')}
                    </th>
                    <th class="utrecht-table__header-cell">
                      ${t('tokenReuseForm.suggestions.table.header.suggestedTokenPath')}
                    </th>
                    <th class="utrecht-table__header-cell">
                      ${t('tokenReuseForm.suggestions.table.header.tokenValue')}
                    </th>
                  </tr>
                </thead>
                <tbody class="utrecht-table__body">
                  ${this.suggestions.map(({ path, suggestion, token }) => {
                    const formFieldId = path.join('.');
                    return html`
                      <tr class="utrecht-table__row">
                        <td class="utrecht-table__cell">
                          <input type="checkbox" value=${formFieldId} id=${formFieldId} name="suggestion" checked />
                        </td>
                        <td class="utrecht-table__cell">
                          <label for=${formFieldId}>
                            <span class="nl-data-badge">${path.join('.')}</span>
                          </label>
                        </td>
                        <td class="utrecht-table__cell">
                          <span class="nl-data-badge">${suggestion.path.join('.')}</span>
                        </td>
                        <td class="utrecht-table__cell">${stringifyToken(token)}</td>
                      </tr>
                    `;
                  })}
                </tbody>
              </table>
            </wizard-table-scroller>
          </div>
          <button class="nl-button nl-button--primary" type="submit">
            ${t('tokenReuseForm.applySuggestions.submit')}
          </button>
          ${this.updatedTokens
            ? html`<wizard-token-output .json=${updatedJson} .downloadJson=${updatedJson}></wizard-token-output>`
            : nothing}
        </wizard-stack>
      </form>
    `;
  }
}
