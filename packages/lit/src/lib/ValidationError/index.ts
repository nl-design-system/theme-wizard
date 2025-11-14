import * as z from 'zod';

export default class ValidationError {
  readonly path: string;
  readonly issues: z.core.$ZodIssue[];
  readonly token: unknown;

  constructor(path: string, errors: z.ZodError) {
    this.path = path;
    this.issues = errors.issues;
  }
}
