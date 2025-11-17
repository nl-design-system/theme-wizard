import * as z from 'zod';

export default class ValidationIssue {
  // TODO: move to application level if necessary
  path: string;
  code: ErrorCode;
  variables: Record<string, string> = {};
  issue: z.core.$ZodIssue;

  constructor(path: string, issue: z.core.$ZodIssue, code: ErrorCode, variables: Record<string, string> = {}) {
    this.path = path;
    this.code = code;
    this.variables = variables;
    this.issue = issue;

    console.log(this.issue);
    console.log(this.variables);
  }

  /* filtering & querying can be done in this class
  for example:
  - filterByPath(issues, path)
  - getUniquePaths(issues)
  */
}
