import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { GroupedIssues } from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import { TemplateModalDialog } from '../wizard-modal-dialog';
import '../wizard-modal-dialog';
import { dialogStyles } from './styles';

const tag = 'theme-wizard-validation-issues-dialog';

@customElement(tag)
export class WizardValidationIssuesDialog extends LitElement {
  @property({ attribute: 'issues' })
  issues: GroupedIssues = {};

  @query('template-modal-dialog')
  private readonly modalDialog!: TemplateModalDialog;

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
      <template-modal-dialog
        .title=${t('tokenDownloadDialog.title')}
        .showConfirmButton=${true}
        .showCancelButton=${true}
        .confirmLabel=${t('tokenDownloadDialog.downloadAnyway')}
        .cancelLabel=${t('tokenDownloadDialog.cancel')}
        aria-describedby="theme-wizard-validation-issues-dialog-description"
      >
        <p id="theme-wizard-validation-issues-dialog-description">${t('tokenDownloadDialog.body')}</p>
        <div class="theme-wizard-validation-issues-dialog__issues">
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
      </template-modal-dialog>
    `;
  }
}
