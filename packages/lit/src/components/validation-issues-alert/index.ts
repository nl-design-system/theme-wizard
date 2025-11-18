import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ValidationIssue from '../../lib/ValidationIssue';

const tag = 'validation-issues-alert';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: ValidationIssuesAlert;
  }
}

const ERROR_CODE_LABELS: Record<string, string> = {
  [ERROR_CODES.INSUFFICIENT_CONTRAST]: 'Onvoldoende contrast',
  [ERROR_CODES.INVALID_REF]: 'Ongeldige referentie',
};

@customElement(tag)
export class ValidationIssuesAlert extends LitElement {
  @property({ type: Array })
  issues: ValidationIssue[] = [];

  /**
   * Group issues by error code
   */
  private get issuesByErrorCode(): Map<string, ValidationIssue[]> {
    const grouped = new Map<string, ValidationIssue[]>();

    for (const issue of this.issues) {
      const code = issue.code;
      if (!grouped.has(code)) {
        grouped.set(code, []);
      }
      grouped.get(code)!.push(issue);
    }

    return grouped;
  }

  override render() {
    if (this.issues.length === 0) {
      return nothing;
    }

    return html`
      <utrecht-alert type="error" data-testid="validation-errors-alert">
        <utrecht-heading-2>Thema validatie fouten</utrecht-heading-2>
        ${Array.from(this.issuesByErrorCode.entries()).map(
          ([errorCode, issues]) => html`
            <details>
              <summary>${ERROR_CODE_LABELS[errorCode] || errorCode} (${issues.length})</summary>
              <ul>
                ${issues.map((issue) => html`<li>${issue.path}: ${issue.issue.message}</li>`)}
              </ul>
            </details>
          `,
        )}
      </utrecht-alert>
    `;
  }
}
