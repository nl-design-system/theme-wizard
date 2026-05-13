import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { StrictThemeSchema, excludeParentKeys } from '@nl-design-system-community/design-tokens-schema';
import checkboxCss from '@utrecht/checkbox-css/dist/index.css?inline';
import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import textareaCss from '@utrecht/textarea-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../wizard-stack';
import { $ZodIssue } from 'zod/v4/core';
import { t } from '../../i18n';
import fileInputStyles from '../wizard-file-input/styles';
import styles from './styles';

const tag = 'wizard-token-validation-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenValidationForm;
  }
}

type Result = { success: true; data: unknown } | { success: false; error: $ZodIssue[] } | null;

@customElement(tag)
export class WizardTokenValidationForm extends LitElement {
  static override readonly styles = [
    unsafeCSS(buttonCss),
    unsafeCSS(checkboxCss),
    unsafeCSS(formFieldCss),
    unsafeCSS(formLabelCss),
    unsafeCSS(textareaCss),
    styles,
    fileInputStyles,
  ];

  @state()
  private result: Result = null;

  private readonly handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const file = data.get('input-file') as File | null;
    if (!file) return;

    let tokens = JSON.parse(await file.text());
    if (data.get('exclude-parent-keys')) {
      tokens = excludeParentKeys(tokens);
    }

    const parsed = StrictThemeSchema.safeParse(tokens);
    this.result = parsed.success
      ? { data: parsed.data, success: true }
      : { error: parsed.error.issues, success: false };
  };

  private renderResult(result: Exclude<Result, null>) {
    return html`
      <output>
        <div
          class="utrecht-form-field utrecht-form-field--text ${classMap({
            'utrecht-form-field--invalid': result.success === false,
          })}"
        >
          <div class="utrecht-form-field__label">
            <label for="validation-result" class="utrecht-form-label">${t('tokenValidationForm.result.label')}</label>
          </div>
          <div id="validation-error-msg" class="utrecht-form-field-description utrecht-form-field__description">
            ${result.success
              ? t('tokenValidationForm.result.noErrors')
              : t('tokenValidationForm.result.errors', { count: result.error.length })}
          </div>
          <div class="utrecht-form-field__input">
            <textarea
              dir="auto"
              readonly
              class="wizard-validation-output utrecht-textarea utrecht-textarea--html-textarea utrecht-textarea--invalid"
              id="validation-result"
              aria-describedby="validation-error-msg"
              aria-invalid=${result.success ? nothing : true}
              .value=${JSON.stringify(result.success ? result.data : result.error, null, 2)}
            ></textarea>
          </div>
        </div>
      </output>
    `;
  }

  override render() {
    return html`
      <wizard-stack size="3xl">
        <form @submit=${this.handleSubmit}>
          <wizard-stack size="3xl">
            <div class="utrecht-form-field utrecht-form-field--text">
              <div class="utrecht-form-field__label">
                <label for="input-file" class="utrecht-form-label">${t('tokenValidationForm.fileInput.label')}</label>
              </div>
              <input type="file" class="wizard-file-input" required accept=".json" id="input-file" name="input-file" />
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

            <button class="nl-button nl-button--primary" type="submit">${t('tokenValidationForm.submit')}</button>
          </wizard-stack>
        </form>

        ${this.result === null ? nothing : this.renderResult(this.result)}
      </wizard-stack>
    `;
  }
}
