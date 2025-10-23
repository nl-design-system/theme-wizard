import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.2 Dimension

export const DimensionValueSchema = z.strictObject({
  unit: z.union([z.literal('px'), z.literal('rem')]),
  value: z.number(),
});

/**
 * @see https://www.designtokens.org/tr/drafts/format/#dimension
 */
export type DimensionValue = z.infer<typeof DimensionValueSchema>;

export const DimensionTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('dimension'),
  $value: DimensionValueSchema,
});

/**
 * @see https://www.designtokens.org/tr/drafts/format/#dimension
 */
export type DimensionToken = z.infer<typeof DimensionTokenSchema>;
