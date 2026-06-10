import type { $ZodIssue } from 'zod/v4/core';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import checkboxCss from '@utrecht/checkbox-css/dist/index.css?inline';
import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { t } from '../../i18n';
import fileInputStyles from '../wizard-file-input/styles';
import '../wizard-form-field-checkbox';
import '../wizard-stack';
import styles from './styles';

const tag = 'wizard-token-upload-form';

export interface WizardUploadEventDetail {
  files: File[];
  excludeParentKeys: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenUploadForm;
  }
}

/**
 * Reusable token file upload form. Emits a `wizard-upload` CustomEvent with
 * the selected files and the "exclude parent keys" checkbox state, so multiple
 * pages can share the same upload UX without duplication.
 *
 * @element wizard-token-upload-form
 * @fires {CustomEvent<WizardUploadEventDetail>} wizard-upload - Fired on form submit with the selected files and options.
 */
@customElement(tag)
export class WizardTokenUploadForm extends LitElement {
  static override readonly styles = [
    unsafeCSS(buttonCss),
    unsafeCSS(checkboxCss),
    unsafeCSS(formFieldCss),
    unsafeCSS(formLabelCss),
    fileInputStyles,
    styles,
  ];

  @property({ type: Boolean })
  invalid = false;

  @property({ type: Array })
  errors: $ZodIssue[] = [];

  @property({ attribute: 'submit-label' })
  submitLabel = '';

  private readonly handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) return;
    const data = new FormData(event.currentTarget);
    const files = data.getAll('input-file') as File[];
    if (files.length === 0) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent<WizardUploadEventDetail>('wizard-upload', {
        bubbles: true,
        composed: true,
        detail: {
          excludeParentKeys: Boolean(data.get('exclude-parent-keys')),
          files,
        },
      }),
    );
  };

  override render() {
    const errorId = 'input-file-error';
    const fileInputId = 'input-file';
    return html`
      <form @submit=${this.handleSubmit}>
        <wizard-stack size="3xl">
          <div
            class="utrecht-form-field utrecht-form-field--text ${classMap({
              'utrecht-form-field--invalid': this.invalid,
            })}"
          >
            <div class="utrecht-form-field__label">
              <label for=${fileInputId} class="utrecht-form-label">${t('tokenValidationForm.fileInput.label')}</label>
            </div>
            ${this.invalid
              ? html`<div id=${errorId} class="utrecht-form-field-description utrecht-form-field__description">
                  ${t('tokenValidationForm.result.errors', { count: this.errors.length })}
                </div>`
              : nothing}
            <input
              type="file"
              class="wizard-file-input"
              required
              multiple
              accept=".json"
              id=${fileInputId}
              name=${fileInputId}
              aria-describedby=${this.invalid ? errorId : nothing}
            />
            ${this.invalid && this.errors.length > 0
              ? html`<ul>
                  ${this.errors.map((error) => html`<li>${error.message} (${error.path.join('.')})</li>`)}
                </ul>`
              : nothing}
          </div>

          <wizard-form-field-checkbox
            name="exclude-parent-keys"
            label=${t('tokenValidationForm.excludeParentKeys.label')}
          ></wizard-form-field-checkbox>

          <button class="nl-button nl-button--primary" type="submit">${this.submitLabel}</button>
        </wizard-stack>
      </form>
    `;
  }
}
