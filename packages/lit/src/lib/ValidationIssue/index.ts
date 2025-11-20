import { ERROR_CODES, type ThemeValidationIssue } from '@nl-design-system-community/design-tokens-schema';
import { TemplateResult } from 'lit';

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES] | 'unknown';

export interface RenderOptions {
  /**
   * Rendering mode
   * - 'detailed': Structured format with clickable tokens and nested details (for validation alerts)
   * - 'compact': Inline text format (for form field errors)
   */
  mode?: 'detailed' | 'compact';

  /**
   * Optional function to render token paths as clickable navigation links
   * Only used in 'detailed' mode
   */
  renderTokenLink?: (tokenPath: string) => TemplateResult;
}

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: ErrorCode;
  details?: ThemeValidationIssue;

  constructor(issue: ThemeValidationIssue, code?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]) {
    this.details = issue;
    this.path = Array.isArray(issue.path)
      ? issue.path
          .filter((p) => p !== '$value')
          .map(String)
          .join('.')
      : '';
    this.code = code || issue.ERROR_CODE || 'unknown';
  }
}
