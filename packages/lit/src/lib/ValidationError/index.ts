import {
  ERROR_CODES,
  StrictThemeSchema,
  type Theme,
  type ThemeValidationIssue,
} from '@nl-design-system-community/design-tokens-schema';
import * as z from 'zod';

export type ValidationIssue = Pick<z.core.$ZodIssue, 'code' | 'message' | 'path'>;

export default class ValidationError {
  readonly path: string;
  readonly issues: ValidationIssue[];
  readonly token: unknown;

  constructor(path: string, errors: z.ZodError, token: unknown) {
    this.path = path;
    this.token = token;

    // Filter to only contrast-related issues (ignore schema validation errors)
    const contrastIssues: ValidationIssue[] = errors.issues
      .filter((issue) => {
        return (
          'ERROR_CODE' in issue &&
          (issue as ThemeValidationIssue).ERROR_CODE === ERROR_CODES.INSUFFICIENT_CONTRAST &&
          (issue.path.join('.').includes(path) || issue.path.join('.').startsWith(path))
        );
      })
      .map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path,
      }));
    console.log(contrastIssues);
    this.issues = contrastIssues;
  }

  get ok(): boolean {
    return this.issues.length === 0;
  }

  static validateTheme(theme: Theme): Map<string, ValidationError> {
    // Validate the entire theme using StrictThemeSchema
    const result = StrictThemeSchema.safeParse(theme);

    const errors = new Map<string, ValidationError>();

    if (!result.success) {
      // Group errors by path (extract the token path from each error)
      const errorsByPath = new Map<string, z.core.$ZodIssue[]>();

      for (const issue of result.error.issues) {
        // Extract the path to the token (remove $value if present)
        const issuePath = issue.path.filter((p) => p !== '$value').join('.');
        if (!errorsByPath.has(issuePath)) {
          errorsByPath.set(issuePath, []);
        }
        errorsByPath.get(issuePath)!.push(issue);
      }

      // Create ValidationError for each path
      for (const [path, issues] of errorsByPath) {
        const zodError = new z.ZodError(issues);
        errors.set(path, new ValidationError(path, zodError, null));
      }
    }

    return errors;
  }
}
