import { ERROR_CODES, type ThemeValidationIssue } from '@nl-design-system-community/design-tokens-schema';

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES] | 'unknown';
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
