import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.7 Number

export const NumberTypeSchema = z.literal('number');
export type NumberType = z.infer<typeof NumberTypeSchema>;

export const NumberTokenSchema = z.looseObject({
  ...BaseDesignTokenSchema.shape,
  $type: NumberTypeSchema,
  $value: z.union([z.number(), TokenReferenceSchema]),
});
export type NumberToken = z.infer<typeof NumberTokenSchema>;
