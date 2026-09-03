import type { DesignTokens } from 'style-dictionary/types';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import type { WizardUploadEventDetail } from '../wizard-token-upload-form';
import { t } from '../../i18n';
import '../wizard-token-upload-form';
import { type TokenFileResult, parseTokenFiles } from '../../lib/TokenFiles';
import { SET_THEME_TOKENS_EVENT, type SetThemeTokensDetail } from '../../utils/events';
import styles from './styles';

const tag = 'wizard-theme-preset-form';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardThemePresetForm;
  }
}

type Result = TokenFileResult | null;

@safeCustomElement(tag)
export class WizardThemePresetForm extends LitElement {
  static override readonly styles = [styles];

  @state()
  private result: Result = null;

  readonly #handleUpload = async (event: CustomEvent<WizardUploadEventDetail>) => {
    const { excludeParentKeys, files } = event.detail;
    const result = await parseTokenFiles(files, excludeParentKeys);
    this.result = result;

    if (!result.success) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<SetThemeTokensDetail>(SET_THEME_TOKENS_EVENT, {
        bubbles: true,
        composed: true,
        detail: { tokens: result.data as DesignTokens },
      }),
    );
  };

  override render() {
    return html`
      <wizard-token-upload-form
        @wizard-upload=${this.#handleUpload}
        ?invalid=${this.result?.success === false}
        .errors=${this.result?.success === false ? this.result.error : []}
        submit-label=${t('themePresetForm.submit')}
      ></wizard-token-upload-form>
    `;
  }
}
