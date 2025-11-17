import * as z from 'zod';

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: ErrorCode;
  variables: Record<string, string> = {};
  issue: z.core.$ZodIssue;

  constructor(issue: z.core.$ZodIssue, code?: ErrorCode) {
    this.issue = issue;
    this.path = issue.path
      .filter((p) => p !== '$value')
      .map(String)
      .join('.');
    this.code = code || (issue.code as ErrorCode);
  }
}
