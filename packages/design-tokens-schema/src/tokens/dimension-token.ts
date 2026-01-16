import { parse_dimension } from '@projectwallace/css-parser';
import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';
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
  ...BaseDesignTokenValueSchema.shape,
  $type: DimensionTypeSchema,
  $value: ModernDimensionValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#dimension */
export type ModernDimensionToken = z.infer<typeof ModernDimensionTokenSchema>;

export const DimensionWithRefSchema = z.object({
  ...BaseDesignTokenValueSchema.shape,
  $type: DimensionTypeSchema,
  $value: TokenReferenceSchema,
});

export const LegacyDimensionTokenValueSchema = z
  .string()
  .nonempty()
  .refine((value) => {
    const { unit } = parse_dimension(value);
    return DimensionUnitSchema.safeParse(unit.toLowerCase()).success;
  }, 'Dimensions MUST use `px` or `rem`');
export type LegacyDimensionTokenValue = z.infer<typeof LegacyDimensionTokenValueSchema>;

export const LegacyDimensionTokenSchema = z
  .object({
    ...BaseDesignTokenValueSchema.shape,
    $type: DimensionTypeSchema,
    $value: LegacyDimensionTokenValueSchema,
  })
  .transform((token) => {
    const { unit, value } = parse_dimension(token.$value);
    return {
      ...token,
      $value: {
        unit: unit.toLowerCase() as DimensionUnit,
        value,
      },
    };
  });
export type LegacyDimensionToken = z.infer<typeof LegacyDimensionTokenSchema>;

export const DimensionTokenSchema = z.union([
  ModernDimensionTokenSchema,
  DimensionWithRefSchema,
  LegacyDimensionTokenSchema,
]);
export type DimensionToken = z.infer<typeof DimensionTokenSchema>;
