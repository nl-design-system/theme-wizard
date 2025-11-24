import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t } from '../../i18n';
import ValidationIssue, { GroupedIssues } from '../../lib/ValidationIssue';
import { WizardTokenNavigator } from '../wizard-token-navigator';
import styles from './styles';

const tag = 'wizard-validation-issues-alert';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationIssuesAlert;
  }
}

@customElement(tag)
export class WizardValidationIssuesAlert extends WizardTokenNavigator {
  @property({ attribute: false })
  issues: GroupedIssues = {};

  static override readonly styles = [unsafeCSS(styles)];

  override render() {
    return html`
      <utrecht-alert type="error">
        <utrecht-heading-2>${t('validation.title')}</utrecht-heading-2>
        ${Object.entries(this.issues).map(([errorCode, issues]) => {
          if (!issues || issues.length === 0) return nothing;

          return html`
            <details>
              <summary>${t(`validation.error.${errorCode}.label`)} (${issues.length})</summary>
              <ul>
                ${issues.map(
                  (issue: ValidationIssue) => html`<li>${t(`validation.error.${issue.code}.detailed`, issue)}</li>`,
                )}
              </ul>
            </details>
          `;
        })}
      </utrecht-alert>
    `;
  }
}
