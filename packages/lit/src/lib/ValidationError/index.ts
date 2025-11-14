import * as z from 'zod';

export default class ValidationError {
  readonly path: string;
  readonly issues: z.core.$ZodIssue[];
  readonly token: unknown;

  constructor(path: string, errors: z.ZodError, token: unknown) {
    this.path = path;
    this.token = token;
    this.issues = errors.issues;
  }

  get ok(): boolean {
    return this.issues.length === 0;
  }
}
