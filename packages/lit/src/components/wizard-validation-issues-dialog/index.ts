import { LitElement, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { GroupedIssues } from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import '../template-modal-dialog';
import { TemplateModalDialog } from '../template-modal-dialog';
import { dialogStyles } from './styles';

const tag = 'theme-wizard-validation-issues-dialog';

@customElement(tag)
export class WizardValidationIssuesDialog extends LitElement {
  @property({ attribute: 'title' }) titleAttr = t('tokenDownloadDialog.title');
  @property({ attribute: 'data' }) data: GroupedIssues = {};

  @query('template-modal-dialog')
  private readonly modalDialog!: TemplateModalDialog;

  static override readonly styles = dialogStyles;

  open() {
    this.modalDialog?.open();
  }

  close(value?: string) {
    this.modalDialog?.close(value);
  }

  private readonly onConfirmSubmit = (event: Event) => {
    event.preventDefault();
    this.close('confirm');
  };

  private readonly onCancelClick = () => {
    this.close('cancel');
  };

  get returnValue(): string {
    return this.modalDialog?.returnValue ?? '';
  }

  override render() {
    return html`
      <template-modal-dialog .title=${this.titleAttr}>
        <form id="ams-dialog-form" novalidate>
          <p id="theme-wizard-validation-issues-dialog-description">${t('tokenDownloadDialog.body')}</p>
          <div class="wizard-validation-issues-dialog__issues">
            ${Object.entries(this.data).map(([errorCode, errors]) => {
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
        </form>
        <div slot="footer" class="ams-action-group" role="group">
          <utrecht-button appearance="primary-action-button" type="button" @click=${this.onConfirmSubmit}>
            ${t('tokenDownloadDialog.downloadAnyway')}
          </utrecht-button>
          <utrecht-button appearance="secondary-action-button" type="button" @click=${this.onCancelClick}>
            ${t('tokenDownloadDialog.cancel')}
          </utrecht-button>
        </div>
      </template-modal-dialog>
    `;
  }
}
