import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import * as z from 'zod';

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
  variables: Record<string, string> = {};
  issue: z.core.$ZodIssue;

  constructor(issue: z.core.$ZodIssue, code?: string) {
    this.issue = issue;
    this.path = issue.path
      .filter((p) => p !== '$value')
      .map(String)
      .join('.');
    this.code = code || (issue.code as (typeof ERROR_CODES)[keyof typeof ERROR_CODES]);
  }
}
