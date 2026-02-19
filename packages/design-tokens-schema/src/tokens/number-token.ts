import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.7 Number
export const NumberSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('number'),
  $value: z.number(),
});

export const NumberWithRefSchema = z.object({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('number'),
  $value: TokenReferenceSchema,
});

export const NumberTokenSchema = z.union([NumberSchema, NumberWithRefSchema]);
export type NumberToken = z.infer<typeof NumberTokenSchema>;
