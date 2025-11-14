import * as z from 'zod';

export type ValidationIssue = Pick<z.core.$ZodIssue, 'code' | 'message' | 'path'>;

export default class ValidationError {
  readonly path: string;
  readonly issues: ValidationIssue[];
  readonly token: unknown;

  constructor(path: string, errors: z.ZodError, token: unknown) {
    this.path = path;
    this.token = token;

    this.issues = this.#getIssues(errors);
  }

  #getIssues(errors: z.ZodError) {
    return errors.issues;
  }

  get ok(): boolean {
    return this.issues.length === 0;
  }
}
