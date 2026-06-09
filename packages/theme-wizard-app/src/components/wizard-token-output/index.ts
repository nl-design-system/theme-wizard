import formFieldCss from '@utrecht/form-field-css/dist/index.css?inline';
import formLabelCss from '@utrecht/form-label-css/dist/index.css?inline';
import textareaCss from '@utrecht/textarea-css/dist/index.css?inline';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { t } from '../../i18n';
import '../wizard-download-button';
import styles from './styles';

const tag = 'wizard-token-output';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenOutput;
  }
}

/**
 * Displays a readonly textarea containing token JSON and a download button.
 * Hidden download button when `downloadJson` is empty.
 *
 * @element wizard-token-output
 */
@customElement(tag)
export class WizardTokenOutput extends LitElement {
  static override readonly styles = [unsafeCSS(formFieldCss), unsafeCSS(formLabelCss), unsafeCSS(textareaCss), styles];

  @property({ type: String })
  json = '';

  @property({ type: Boolean })
  invalid = false;

  @property({ type: String })
  description = '';

  @property({ attribute: 'download-json', type: String })
  downloadJson = '';

  override render() {
    const descriptionId = this.description ? 'token-output-description' : undefined;
    return html`
      <output>
        <div
          class="utrecht-form-field utrecht-form-field--text ${classMap({
            'utrecht-form-field--invalid': this.invalid,
          })}"
        >
          <div class="utrecht-form-field__label">
            <label for="token-output" class="utrecht-form-label">${t('tokenValidationForm.result.label')}</label>
          </div>
          ${this.description
            ? html`<div
                id="token-output-description"
                class="utrecht-form-field-description utrecht-form-field__description"
              >
                ${this.description}
              </div>`
            : nothing}
          <div class="utrecht-form-field__input">
            <textarea
              dir="auto"
              readonly
              class="wizard-validation-output utrecht-textarea utrecht-textarea--html-textarea utrecht-textarea--invalid"
              id="token-output"
              aria-describedby=${descriptionId ?? nothing}
              aria-invalid=${this.invalid ? true : nothing}
              .value=${this.json}
            ></textarea>
          </div>
        </div>
      </output>
      <wizard-download-button .content=${this.downloadJson}>
        ${t('tokenValidationForm.downloadTokens')}
      </wizard-download-button>
    `;
  }
}
