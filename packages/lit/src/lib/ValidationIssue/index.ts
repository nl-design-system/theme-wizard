import rosetta from 'rosetta';
import * as z from 'zod';
import messages, { type ErrorCode } from './messages'

const i18n = rosetta(messages)
i18n.locale('nl');

export default class ValidationIssue {
  // TODO: move to application level if necessary
  static i18n = i18n;
  path: string;
  code: ErrorCode;
  variables: Record<string, string> = {};
  issue: z.core.$ZodIssue;

  constructor(path: string, issue: z.core.$ZodIssue, , code: ErrorCode, variables: Record<string, string> = {}) {
    this.path = path;
    this.code = code;
    this.variables = variables;
    this.issue = issue;
  }

  toString() {
    return ValidationIssue.i18n.t(this.code, this.variables);
  }

  /* filtering & querying can be done in this class
  for example:
  - filterByPath(issues, path)
  - getUniquePaths(issues)
  */
}
