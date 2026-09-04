import type { DesignTokens } from 'style-dictionary/types';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { state } from 'lit/decorators.js';
import type { WizardUploadEventDetail } from '../wizard-token-upload-form';
import { t } from '../../i18n';
import '@nl-design-system-community/clippy-components/clippy-stack';
import '../wizard-token-upload-form';
import { type ThemePresetResult, parseThemePreset } from '../../lib/TokenFiles';
import ValidationIssue from '../../lib/ValidationIssue';
import { SET_THEME_TOKENS_EVENT, type SetThemeTokensDetail } from '../../utils/events';
import styles from './styles';

const tag = 'wizard-theme-preset-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardThemePresetForm;
  }
}

type SuccessResult = Extract<ThemePresetResult, { success: true }>;

@safeCustomElement(tag)
export class WizardThemePresetForm extends LitElement {
  static override readonly styles = [unsafeCSS(buttonCss), styles];

  @state()
  private result: ThemePresetResult | null = null;

  readonly #handleUpload = async (event: CustomEvent<WizardUploadEventDetail>) => {
    const { excludeParentKeys, files } = event.detail;
    this.result = await parseThemePreset(files, excludeParentKeys);
  };

  readonly #handleFileInputChange = () => {
    // Reset the errors whenever we change the file.
    this.result = null;
  };

  readonly #handleConfirm = () => {
    if (!this.result?.success) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<SetThemeTokensDetail>(SET_THEME_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail: { tokens: this.result.data as DesignTokens },
      }),
    );
  };

  #renderSummary(result: SuccessResult) {
    return html`
      <clippy-stack size="lg" class="wizard-theme-preset-form__summary">
        <p>${t('themePresetForm.summary.uploadedTokens', { count: result.uploadedTokenCount })}</p>

        ${
          result.filledFromDefaultsPaths.length > 0
            ? html`
                <details>
                  <summary>
                    ${t('themePresetForm.summary.filledFromDefaults', { count: result.filledFromDefaultsPaths.length })}
                  </summary>
                  <ul>
                    ${result.filledFromDefaultsPaths.map((path) => html`<li>${path}</li>`)}
                  </ul>
                </details>
              `
            : nothing
        }
        ${
          result.softIssues.length > 0
            ? html`
                <details>
                  <summary>${t('themePresetForm.summary.softIssues', { count: result.softIssues.length })}</summary>
                  <ul>
                    ${result.softIssues.map((issue) => {
                      const validationIssue = new ValidationIssue(issue);
                      return html`<li>${t(`validation.error.${validationIssue.code}.detailed`, validationIssue)}</li>`;
                    })}
                  </ul>
                </details>
              `
            : nothing
        }

        <button class="nl-button nl-button--primary" type="button" @click=${this.#handleConfirm}>
          ${t('themePresetForm.confirm')}
        </button>
      </clippy-stack>
    `;
  }

  override render() {
    return html`
      <wizard-token-upload-form
        @change=${this.#handleFileInputChange}
        @wizard-upload=${this.#handleUpload}
        ?invalid=${this.result?.success === false}
        .errors=${this.result?.success === false ? this.result.error : []}
        submit-label=${t('themePresetForm.submit')}
      ></wizard-token-upload-form>

      ${this.result?.success ? this.#renderSummary(this.result) : nothing}
    `;
  }
}
