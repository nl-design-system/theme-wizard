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
  errors: GroupedIssues = {};

  static override readonly styles = [unsafeCSS(styles)];

  override render() {
    return html`
      <utrecht-alert type="error">
        <utrecht-heading-2>${t('validation.title')}</utrecht-heading-2>
        ${Object.entries(this.errors).map(([errorCode, errors]) => {
          if (!errors || errors.length === 0) return nothing;

          return html`
            <details>
              <summary>${t(`validation.error.${errorCode}.label`)} (${errors.length})</summary>
              <ul>
                ${errors.map(
                  (error: ValidationIssue) => html`<li>${t(`validation.error.${error.code}.detailed`, error)}</li>`,
                )}
              </ul>
            </details>
          `;
        })}
      </utrecht-alert>
    `;
  }
}
