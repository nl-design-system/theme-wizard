import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// Line height is not an official DTCG token type but a very commonly used
// type in the NLDS space, so for that we have this validator.
// Our goal here is to validate the correct type and then to convert it back
// to a `number` type

/**
 * Value may be a stringified number like "1.5". In that case the stringified value is the same as the original.
 */
const StringifiedNumberSchema = z
  .string()
  .refine((str) => Number.parseFloat(str).toString() === str, 'String must be a valid numeric representation')
  .transform((str) => Number.parseFloat(str));

const LineHeightValueSchema = z.union([z.number(), StringifiedNumberSchema]);
export type LineHeightValue = z.infer<typeof LineHeightValueSchema>;

const typeToNumberTransform = (value: Record<string, unknown>) => ({
  ...value,
  $extensions: {
    ...(value['$extensions'] ?? Object.create(null)),
    ['nl.nldesignsystem.subtype']: 'line-height',
  },
  $type: 'number',
});

export const LineHeightTypeSchema = z.union([z.literal('lineHeight'), z.literal('number')]);
export type LineHeightType = z.infer<typeof LineHeightTypeSchema>;

export const LineHeightSchema = z
  .object({
    ...BaseDesignTokenValueSchema.shape,
    $type: LineHeightTypeSchema,
    $value: LineHeightValueSchema,
  })
  .transform(typeToNumberTransform);
export type LineHeight = z.infer<typeof LineHeightSchema>;

export const LineHeightWithRefSchema = z
  .object({
    ...BaseDesignTokenValueSchema.shape,
    $type: LineHeightTypeSchema,
    $value: TokenReferenceSchema,
  })
  .transform(typeToNumberTransform);
export type LineHeightWithRef = z.infer<typeof LineHeightWithRefSchema>;

export const LineHeightTokenSchema = z.union([LineHeightSchema, LineHeightWithRefSchema]).superRefine((token, ctx) => {
  if (token.$value < 1.5) {
    ctx.addIssue({
      actual: token.$value,
      code: 'too_small',
      ERROR_CODE: 'line_height_too_small',
      input: token.$value,
      message: `Line heigt is too small`,
      minimum: 1,
      origin: 'number',
      path: ['$value'],
    });
  }
  return true;
});
export type LineHeightToken = z.infer<typeof LineHeightTokenSchema>;
