import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t, errorLabel, renderError } from '../../i18n/messages';
import ValidationIssue from '../../lib/ValidationIssue';
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
  issues: Partial<Record<ValidationIssue['code'], ValidationIssue[]>> = {};

  static override readonly styles = [unsafeCSS(styles)];

  override render() {
    return html`
      <utrecht-alert type="error">
        <utrecht-heading-2>${t('validation.title')}</utrecht-heading-2>
        ${Object.entries(this.issues).map(([errorCode, issues]) => {
          if (!issues || issues.length === 0) return nothing;
          const label = errorLabel(errorCode as ValidationIssue['code']);
          const count = issues.length;

          return html`
            <details>
              <summary>${label} (${count})</summary>
              <ul>
                ${issues.map(
                  (issue) =>
                    html`<li>
                      ${renderError(issue, {
                        mode: 'detailed',
                        renderTokenLink: this.renderTokenLink.bind(this),
                      })}
                    </li>`,
                )}
              </ul>
            </details>
          `;
        })}
      </utrecht-alert>
    `;
  }
}
