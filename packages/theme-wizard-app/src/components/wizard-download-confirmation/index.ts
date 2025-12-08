import '@nl-design-system-community/clippy-components/clippy-modal';
import { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { GroupedIssues } from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import { dialogStyles } from './styles';

const tag = 'wizard-download-confirmation';
const ariaDescribedby = 'wizard-download-confirmation-description';

@customElement(tag)
export class WizardDownloadConfirmation extends LitElement {
  @property({ attribute: 'issues' })
  issues: GroupedIssues = {};

  @query('clippy-modal')
  private readonly modalDialog!: ClippyModal;

  static override readonly styles = dialogStyles;

  open() {
    this.modalDialog?.open();
  }

  close(value?: string) {
    this.modalDialog?.close(value);
  }

  get returnValue(): string {
    return this.modalDialog?.returnValue ?? '';
  }

  override render() {
    return html`
      <clippy-modal
        .title=${t('tokenDownloadDialog.title')}
        actions="both"
        .confirmLabel=${t('tokenDownloadDialog.downloadAnyway')}
        .cancelLabel=${t('tokenDownloadDialog.cancel')}
        aria-describedby=${ariaDescribedby}
      >
        <p id=${ariaDescribedby}>${t('tokenDownloadDialog.body')}</p>
        <div class="theme-wizard-download-confirmation__issues">
          ${Object.entries(this.issues).map(([errorCode, errors]) => {
            if (!errors || errors.length === 0) return nothing;

            return html`
              <details>
                <summary>${t(`validation.error.${errorCode}.label`)} (${errors.length})</summary>
                <ul>
                  ${errors.map(
                    (error) =>
                      html`<li>
                        ${t(`validation.error.${error.code}.compact`, {
                          ...error,
                        })}
                      </li>`,
                  )}
                </ul>
              </details>
            `;
          })}
        </div>
      </clippy-modal>
    `;
  }
}
