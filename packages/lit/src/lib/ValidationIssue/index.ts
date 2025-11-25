import { ERROR_CODES, type ThemeValidationIssue } from '@nl-design-system-community/design-tokens-schema';

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES] | 'unknown';

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: ErrorCode;
  referredToken?: string;
  actual?: number;
  ERROR_CODE?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
  tokens?: string[];
  message!: string;
  minimum?: number;
  [key: string]: unknown;

  constructor(issue: ThemeValidationIssue, code?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]) {
    Object.assign(this, issue);
    this.path = Array.isArray(issue.path)
      ? issue.path
          .filter((p) => p !== '$value')
          .map(String)
          .join('.')
      : '';
    this.referredToken = this.tokens?.find((token: string) => token !== this.path);
    this.code = code || issue.ERROR_CODE || 'unknown';
  }
}

export type GroupedIssues = Partial<Record<ErrorCode, ValidationIssue[]>>;
