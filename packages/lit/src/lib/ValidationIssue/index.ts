import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import * as z from 'zod';

type ZodIssueWithErrorCode = z.core.$ZodIssue & {
  ERROR_CODE?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
};

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES] | 'unknown';
  variables: Record<string, string> = {};
  issue: z.core.$ZodIssue;
  id: string;

  constructor(issue: z.core.$ZodIssue, code?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES]) {
    this.issue = issue;
    this.path = issue.path
      .filter((p) => p !== '$value')
      .map(String)
      .join('.');
    this.code = code || (issue as ZodIssueWithErrorCode).ERROR_CODE || 'unknown';
    this.id = `${this.path}-error-${this.code}`;
  }
}
