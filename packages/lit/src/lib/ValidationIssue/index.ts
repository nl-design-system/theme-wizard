import * as z from 'zod';

export default class ValidationIssue {
  path: string;
  issue: z.core.$ZodIssue;

  constructor(path: string, issue: z.core.$ZodIssue) {
    this.path = path;
    this.issue = issue;
  }

  /* filtering & querying can be done in this class
  for example:
  - filterByPath(issues, path)
  - getUniquePaths(issues)
  */
}
