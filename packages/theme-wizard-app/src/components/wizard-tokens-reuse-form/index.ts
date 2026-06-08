import { findReusableTokens, type TokenCandidate } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { WizardUploadEventDetail } from '../wizard-token-upload-form';
import '../wizard-reuse-suggestions-table';
import '../wizard-stack';
import '../wizard-token-upload-form';
import { t } from '../../i18n';
import { type TokenFileResult, parseTokenFiles } from '../../lib/TokenFiles';
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
  static override readonly styles = [styles];

  @state()
  private parsedTokens: Result = null;

  private suggestedReusableTokens: TokenCandidate[] = [];

  private readonly handleUpload = async (event: CustomEvent<WizardUploadEventDetail>) => {
    const { excludeParentKeys, files } = event.detail;
    this.parsedTokens = await parseTokenFiles(files, excludeParentKeys);

    if (this.parsedTokens.success) {
      this.suggestedReusableTokens = findReusableTokens(this.parsedTokens.data);
    }
  };

  override render() {
    return html`
      <wizard-stack size="3xl">
        <wizard-token-upload-form
          @wizard-upload=${this.handleUpload}
          ?invalid=${this.parsedTokens?.success === false}
          .errors=${this.parsedTokens?.success === false ? this.parsedTokens.error : []}
          submit-label=${t('tokenReuseForm.submit')}
        ></wizard-token-upload-form>

        ${this.parsedTokens?.success
          ? html`<wizard-reuse-suggestions-table
              .suggestions=${this.suggestedReusableTokens}
              .tokens=${this.parsedTokens.data}
            ></wizard-reuse-suggestions-table>`
          : nothing}
      </wizard-stack>
    `;
  }
}
