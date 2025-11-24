import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type ValidationIssue from '../../lib/ValidationIssue';
import { t } from '../../i18n';
import { WizardTokenNavigator } from '../wizard-token-navigator';
import styles from './styles';

const tag = 'wizard-validation-issue';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationIssue;
  }
}

/**
 * Displays validation errors in inline format
 * Used within form fields to show validation feedback
 */
@customElement(tag)
export class WizardValidationIssue extends WizardTokenNavigator {
  @property({ attribute: false })
  issues: ValidationIssue[] = [];

  static override readonly styles = [styles];

  override render() {
    if (this.issues.length === 0) {
      return nothing;
    }

    return html`<div class="theme-error">
      ${this.issues.map(
        (issue) =>
          html`<div class="utrecht-form-field-error-message">
            ${t(`validation.error.${issue.code}.compact`, issue)}
          </div>`,
      )}
    </div>`;
  }
}
