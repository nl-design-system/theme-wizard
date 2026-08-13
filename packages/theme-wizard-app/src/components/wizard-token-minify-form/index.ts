import { removeExtensions, removeNonTokenProperties } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { WizardUploadEventDetail } from '../wizard-token-upload-form';
import { t } from '../../i18n';
import '../wizard-stack';
import '../wizard-token-output';
import '../wizard-token-upload-form';
import { readTokenFiles } from '../../lib/TokenFiles';

const tag = 'wizard-token-minify-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenMinifyForm;
  }
}

type Result = Record<string, unknown> | null;

@customElement(tag)
export class WizardTokenMinifyForm extends LitElement {
  @state()
  private result: Result = null;

  private readonly handleUpload = async (event: CustomEvent<WizardUploadEventDetail>) => {
    const { excludeParentKeys, files } = event.detail;
    this.result = removeNonTokenProperties(removeExtensions(await readTokenFiles(files, excludeParentKeys)));
  };

  private renderResult(result: NonNullable<Result>) {
    const json = JSON.stringify(result, null, 2);
    return html` <wizard-token-output .json=${json} .downloadJson=${result ? json : ''}></wizard-token-output> `;
  }

  override render() {
    return html`
      <wizard-stack size="3xl">
        <wizard-token-upload-form
          @wizard-upload=${this.handleUpload}
          submit-label=${t('tokenMinifyForm.submit')}
        ></wizard-token-upload-form>

        ${this.result === null ? nothing : this.renderResult(this.result)}
      </wizard-stack>
    `;
  }
}
