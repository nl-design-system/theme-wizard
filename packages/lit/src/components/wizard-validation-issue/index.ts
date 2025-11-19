import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type ValidationIssue from '../../lib/ValidationIssue';
import { ValidationErrorRenderer } from '../../lib/ValidationErrorRenderer';
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
export class WizardValidationIssue extends LitElement {
  @property({ attribute: false })
  errors: ValidationIssue[] = [];

  static override readonly styles = [styles];

  override render() {
    if (this.errors.length === 0) {
      return nothing;
    }

    return html`<div class="theme-error">
      ${this.errors.map(
        (error) =>
          html`<div class="utrecht-form-field-error-message">
            ${ValidationErrorRenderer.render(error, { format: 'inline' })}
          </div>`,
      )}
    </div>`;
  }
}
