import * as z from 'zod';

export const ERROR_CODES = {
  FONT_SIZE_TOO_SMALL: 'font_size_too_small',
  INSUFFICIENT_CONTRAST: 'insufficient_contrast',
  INVALID_REF: 'invalid_ref',
  LINE_HEIGHT_TOO_SMALL: 'line_height_too_small',
  UNEXPECTED_UNIT: 'unexpected_unit',
} as const;

export type ContrastIssue = z.core.$ZodSuperRefineIssue & {
  ERROR_CODE: typeof ERROR_CODES.INSUFFICIENT_CONTRAST;
  actual: number;
  tokens: [string] | [string, string];
  path: string[];
  code: 'too_small';
  message: 'Insufficient contrast';
  minimum: number;
  origin: 'number';
};

export type InvalidRefIssue = z.core.$ZodSuperRefineIssue & {
  ERROR_CODE: typeof ERROR_CODES.INVALID_REF;
  code: 'custom';
  message?: string;
};

export type LineHeightUnitIssue = z.core.$ZodSuperRefineIssue & {
  ERROR_CODE: typeof ERROR_CODES.UNEXPECTED_UNIT;
  code: 'invalid_type';
  message: string;
  path: string[];
};

export type MinimumLineHeightIssue = z.core.$ZodSuperRefineIssue & {
  ERROR_CODE: typeof ERROR_CODES.LINE_HEIGHT_TOO_SMALL;
  code: 'too_small';
  message: string;
  path: string[];
  minimum: number;
  expected: 'number';
  input: number;
  actual: number;
};

export type MinFontSizeIssue = z.core.$ZodSuperRefineIssue & {
  ERROR_CODE: typeof ERROR_CODES.FONT_SIZE_TOO_SMALL;
  code: 'custom';
  message: string;
  actual: string;
  path: string[];
  minimum: string;
};

export type ThemeValidationIssue =
  | (z.core.$ZodIssue & {
      ERROR_CODE?: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
    })
  | ContrastIssue
  | InvalidRefIssue
  | LineHeightUnitIssue
  | MinFontSizeIssue;

export const createContrastIssue = ({
  actual,
  minimum,
  path,
  tokens,
}: {
  actual: number;
  tokens: [string] | [string, string];
  path: string[];
  minimum: number;
}): ContrastIssue => {
  return {
    actual,
    code: 'too_small',
    ERROR_CODE: ERROR_CODES.INSUFFICIENT_CONTRAST,
    message: 'Insufficient contrast',
    minimum,
    origin: 'number',
    path,
    tokens,
  };
};
