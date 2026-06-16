import { LitElement, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { WizardUploadEventDetail } from '../wizard-token-upload-form';
import { t } from '../../i18n';
import { type TokenFileResult, parseTokenFiles } from '../../lib/TokenFiles';
import '../wizard-stack';
import '../wizard-token-output';
import '../wizard-token-upload-form';
import styles from './styles';

const tag = 'wizard-token-validation-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenValidationForm;
  }
}

type Result = TokenFileResult | null;

@customElement(tag)
export class WizardTokenValidationForm extends LitElement {
  static override readonly styles = [styles];

  @state()
  private result: Result = null;

  private readonly handleUpload = async (event: CustomEvent<WizardUploadEventDetail>) => {
    const { excludeParentKeys, files } = event.detail;
    this.result = await parseTokenFiles(files, excludeParentKeys);
  };

  private renderResult(result: NonNullable<Result>) {
    const json = JSON.stringify(result.success ? result.data : result.error, null, 2);
    const description = result.success
      ? t('tokenValidationForm.result.noErrors')
      : t('tokenValidationForm.result.errors', { count: result.error.length });
    return html`
      <wizard-token-output
        .json=${json}
        .downloadJson=${result.success ? json : ''}
        ?invalid=${!result.success}
        description=${description}
      ></wizard-token-output>
    `;
  }

  override render() {
    return html`
      <wizard-stack size="3xl">
        <wizard-token-upload-form
          @wizard-upload=${this.handleUpload}
          submit-label=${t('tokenValidationForm.submit')}
        ></wizard-token-upload-form>

        ${this.result === null ? nothing : this.renderResult(this.result)}
      </wizard-stack>
    `;
  }
}
