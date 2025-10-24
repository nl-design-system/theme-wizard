import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.2 Dimension

export const DimensionUnitSchema = z.union([z.literal('px'), z.literal('rem')]);

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type DimensionUnit = z.infer<typeof DimensionUnitSchema>;

export const DimensionValueSchema = z.strictObject({
  unit: DimensionUnitSchema,
  value: z.number(),
});

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type DimensionValue = z.infer<typeof DimensionValueSchema>;

export const DimensionTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('dimension'),
  $value: DimensionValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type DimensionToken = z.infer<typeof DimensionTokenSchema>;
