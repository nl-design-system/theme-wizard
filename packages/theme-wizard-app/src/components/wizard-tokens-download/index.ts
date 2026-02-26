import { consume } from '@lit/context';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import '../wizard-layout';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../wizard-scraper';
import type Theme from '../../lib/Theme';
import type { WizardDownloadConfirmation } from '../wizard-download-confirmation';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import '@nl-design-system-community/clippy-components/clippy-heading';

const tag = 'wizard-tokens-download';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokensDownload;
  }
}

@customElement(tag)
export class WizardTokensDownload extends LitElement {
  static override readonly styles = [unsafeCSS(buttonLinkStyles)];

  @consume({ context: themeContext, subscribe: true })
  private readonly theme!: Theme;

  @query('wizard-download-confirmation')
  private readonly dialogElement?: WizardDownloadConfirmation;

  readonly #downloadJSON = async () => {
    const data = await this.theme.toTokensJSON();
    const encoded = encodeURIComponent(data);
    const href = `data:application/json,${encoded}`;
    const anchor = document.createElement('a');
    anchor.download = 'tokens.json';
    anchor.href = href;
    anchor.click();
    anchor.remove();
  };

  readonly #handleDownloadClick = () => {
    if (this.theme.errorCount > 0) {
      this.dialogElement?.open();
      return;
    }

    this.#downloadJSON();
  };

  readonly #handleDialogClose = (event: Event) => {
    const dialog = event.currentTarget as WizardDownloadConfirmation;
    if (dialog.returnValue === 'confirm') {
      this.#downloadJSON();
    }
  };

  override render() {
    if (!this.theme) {
      return html`<div>Loading...</div>`;
    }

    return html`
      <wizard-download-confirmation
        .issues=${this.theme.groupedIssues}
        @close=${this.#handleDialogClose}
      ></wizard-download-confirmation>

      <utrecht-button
        appearance="primary-action-button"
        type="button"
        ?disabled=${!this.theme.modified}
        @click=${this.#handleDownloadClick}
      >
        ${t('tokenDownloadDialog.triggerText')}
      </utrecht-button>
    `;
  }
}
