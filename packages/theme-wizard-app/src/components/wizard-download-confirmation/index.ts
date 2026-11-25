import '@nl-design-system-community/clippy-components/clippy-modal';
import { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { ValidationIssueGroup } from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import componentStyles from './styles';

const tag = 'wizard-download-confirmation';
const ariaDescribedby = 'wizard-download-confirmation-description';

@customElement(tag)
export class WizardDownloadConfirmation extends LitElement {
  @property({ attribute: 'issues' })
  issues: ValidationIssueGroup[] = [];

  @query('clippy-modal')
  private readonly modalDialog!: ClippyModal;

  static override readonly styles = componentStyles;

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
          ${Object.entries(Object.groupBy(this.issues, ({ code }) => code)).map(([errorCode, groups]) => {
            if (!groups || groups.length === 0) return nothing;

            return html`
              <details>
                <summary>${t(`validation.error.${errorCode}.label`)} (${groups.length})</summary>
                <ul>
                  ${groups.map(
                    (group) => html`
                      <li>
                        <b>${group.representative.path}</b>:
                        <br />
                        ${t(`validation.error.${group.code}.message`, {
                          ...group.representative,
                        })}
                        ${
                          group.issues.length > 1
                            ? html`
                                <ul>
                                  ${group.issues.map((issue) => html`<li><b>${issue.path}</b></li>`)}
                                </ul>
                              `
                            : nothing
                        }
                      </li>
                    `,
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
