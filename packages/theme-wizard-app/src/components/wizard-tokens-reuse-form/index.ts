import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import dataBadgeCss from '@nl-design-system-candidate/data-badge-css/data-badge.css?inline';
import {
  type TokenCandidate,
  findReusableTokens,
  applyReusableTokens,
} from '@nl-design-system-community/design-tokens-schema';
import checkboxCss from '@utrecht/checkbox-css/dist/index.css?inline';
import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import tableCss from '@utrecht/table-css/dist/index.css?inline';
import textareaCss from '@utrecht/textarea-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../wizard-download-button';
import '../wizard-stack';
import { classMap } from 'lit/directives/class-map.js';
import { $ZodIssue } from 'zod/v4/core';
import { t } from '../../i18n';
import { type TokenFileResult, parseTokenFiles } from '../../lib/TokenFiles';
import { stringifyToken } from '../../utils/token-utils';
import fileInputStyles from '../wizard-file-input/styles';
import '../wizard-table-scroller';
import styles from './styles';

const tag = 'wizard-tokens-reuse-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokensReuseForm;
  }
}

type Result = TokenFileResult | null;

@customElement(tag)
export class WizardTokensReuseForm extends LitElement {
  static override readonly styles = [
    unsafeCSS(dataBadgeCss),
    unsafeCSS(buttonCss),
    unsafeCSS(checkboxCss),
    unsafeCSS(formFieldCss),
    unsafeCSS(formLabelCss),
    unsafeCSS(tableCss),
    unsafeCSS(textareaCss),
    styles,
    fileInputStyles,
  ];

  @state()
  private parsedTokens: Result = null;
  private suggestedReusableTokens: TokenCandidate[] = [];
  private updatedTokens: Record<string, unknown> | null = null;

  private readonly handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) return;
    const data = new FormData(event.currentTarget);
    const files = data.getAll('input-file') as File[];
    if (files.length === 0) {
      return;
    }
    this.parsedTokens = await parseTokenFiles(files, Boolean(data.get('exclude-parent-keys')));

    if (this.parsedTokens.success) {
      const suggestions = findReusableTokens(this.parsedTokens.data as Record<string, unknown>);
      this.suggestedReusableTokens = suggestions;
    }
  };

  private readonly renderParseErrors = (errors: $ZodIssue[]) => {
    return html`
      <ul>
        ${errors.map((error) => html` <li>${error.message} (${error.path.join('.')})</li> `)}
      </ul>
    `;
  };

  private readonly handleApplySuggestions = (event: SubmitEvent) => {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement) || this.parsedTokens?.success === false) return;
    const data = new FormData(event.currentTarget);

    const checkedPaths = new Set(data.getAll('suggestion'));
    const stagedSuggestions = this.suggestedReusableTokens.filter((token) => checkedPaths.has(token.path.join('.')));

    this.updatedTokens = applyReusableTokens(this.parsedTokens?.data as Record<string, unknown>, stagedSuggestions);
    this.requestUpdate();
  };

  private readonly renderSuggestionsForm = (suggestions: TokenCandidate[]) => {
    if (suggestions.length === 0) {
      return html`<p>${t('tokenReuseForm.suggestions.notFound')}</p>`;
    }

    return html`
      <form @submit=${this.handleApplySuggestions}>
        <wizard-stack size="3xl">
          <div
            class="utrecht-form-field utrecht-form-field--text ${classMap({
              'utrecht-form-field--invalid': this.parsedTokens?.success === false,
            })}"
          >
            <div class="utrecht-form-field__label">
              <label for="input-file" class="utrecht-form-label">${t('tokenReuseForm.suggestions.label')}</label>
            </div>
            <wizard-table-scroller>
              <table class="utrecht-table">
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
                  ${suggestions.map(({ path, suggestion, token }) => {
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
          ${this.updatedTokens ? this.renderResult(this.updatedTokens) : nothing}
        </wizard-stack>
      </form>
    `;
  };

  private renderResult(result: typeof this.updatedTokens) {
    const json = JSON.stringify(result, null, 2);
    return html`
      <output>
        <div class="utrecht-form-field utrecht-form-field--text">
          <div class="utrecht-form-field__label">
            <label for="validation-result" class="utrecht-form-label">${t('tokenValidationForm.result.label')}</label>
          </div>
          <div class="utrecht-form-field__input">
            <textarea
              dir="auto"
              readonly
              class="wizard-validation-output utrecht-textarea utrecht-textarea--html-textarea utrecht-textarea--invalid"
              id="validation-result"
              .value=${json}
            ></textarea>
          </div>
        </div>
      </output>
      <wizard-download-button .content=${json}> ${t('tokenValidationForm.downloadTokens')} </wizard-download-button>
    `;
  }

  override render() {
    return html`
      <wizard-stack size="3xl">
        <form @submit=${this.handleSubmit}>
          <wizard-stack size="3xl">
            <div
              class="utrecht-form-field utrecht-form-field--text ${classMap({
                'utrecht-form-field--invalid': this.parsedTokens?.success === false,
              })}"
            >
              <div class="utrecht-form-field__label">
                <label for="input-file" class="utrecht-form-label">${t('tokenValidationForm.fileInput.label')}</label>
              </div>
              ${this.parsedTokens?.success === false
                ? html`<div
                    id="input-file-error"
                    class="utrecht-form-field-description utrecht-form-field__description"
                  >
                    ${t('tokenValidationForm.result.errors', { count: this.parsedTokens.error.length })}
                  </div>`
                : nothing}
              <input
                type="file"
                class="wizard-file-input"
                required
                multiple
                accept=".json"
                id="input-file"
                name="input-file"
                aria-describedby=${this.parsedTokens?.success === false ? 'input-file-error' : nothing}
              />
              ${this.parsedTokens?.success === false ? this.renderParseErrors(this.parsedTokens.error) : nothing}
            </div>

            <div class="utrecht-form-field utrecht-form-field--checkbox">
              <div class="utrecht-form-field__label utrecht-form-field__label--checkbox">
                <label for="exclude-parent-keys" class="utrecht-form-label utrecht-form-label--checkbox">
                  <input
                    type="checkbox"
                    name="exclude-parent-keys"
                    id="exclude-parent-keys"
                    class="utrecht-checkbox utrecht-checkbox--html-input utrecht-checkbox--custom utrecht-form-field__input"
                  />
                  ${t('tokenValidationForm.excludeParentKeys.label')}
                </label>
              </div>
            </div>

            <button class="nl-button nl-button--primary" type="submit">${t('tokenReuseForm.submit')}</button>
          </wizard-stack>
        </form>

        ${this.parsedTokens?.success ? this.renderSuggestionsForm(this.suggestedReusableTokens) : nothing}
      </wizard-stack>
    `;
  }
}
