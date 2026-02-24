import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.2 Dimension

export const DimensionTypeSchema = z.literal('dimension');
export type DimensionType = z.infer<typeof DimensionTypeSchema>;

export const DimensionUnitSchema = z.union([z.literal('px'), z.literal('rem')]);

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type DimensionUnit = z.infer<typeof DimensionUnitSchema>;

export const ModernDimensionValueSchema = z.strictObject({
  unit: DimensionUnitSchema,
  value: z.number(),
});

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type ModernDimensionValue = z.infer<typeof ModernDimensionValueSchema>;

export const ModernDimensionTokenSchema = z.strictObject({
  ...BaseDesignTokenSchema.shape,
  $type: DimensionTypeSchema,
  $value: ModernDimensionValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type ModernDimensionToken = z.infer<typeof ModernDimensionTokenSchema>;

export const DimensionWithRefSchema = z.object({
  ...BaseDesignTokenSchema.shape,
  $type: DimensionTypeSchema,
  $value: TokenReferenceSchema,
});

export const DimensionTokenSchema = z.union([ModernDimensionTokenSchema, DimensionWithRefSchema]);
export type DimensionToken = z.infer<typeof DimensionTokenSchema>;
