import type { TemplateResult } from 'lit';
import { html } from 'lit';
import type ValidationIssue from '../ValidationIssue';

export class InvalidRefErrorRenderer {
  static render(error: ValidationIssue): TemplateResult | null {
    return html`<p>${error.path}</p>`;
  }
}
