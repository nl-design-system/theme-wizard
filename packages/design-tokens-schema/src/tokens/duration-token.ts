import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.5 Duration

export const DurationTypeSchema = z.literal('duration');
export type DurationType = z.infer<typeof DurationTypeSchema>;

export const DurationUnitSchema = z.enum(['s', 'ms']);

/** @see https://www.designtokens.org/tr/2025.10/format/#duration */
export type DurationUnit = z.infer<typeof DurationUnitSchema>;

export const ModernDurationValueSchema = z.strictObject({
  unit: DurationUnitSchema,
  value: z.number(),
});

/** @see https://www.designtokens.org/tr/2025.10/format/#duration */
export type ModernDurationValue = z.infer<typeof ModernDurationValueSchema>;

export const ModernDurationTokenSchema = z.strictObject({
  ...BaseDesignTokenSchema.shape,
  $type: DurationTypeSchema,
  $value: ModernDurationValueSchema,
});

/** @see https://www.designtokens.org/tr/2025.10/format/#duration */
export type ModernDurationToken = z.infer<typeof ModernDurationTokenSchema>;

export const DurationWithRefSchema = z.object({
  ...BaseDesignTokenSchema.shape,
  $type: DurationTypeSchema,
  $value: TokenReferenceSchema,
});
export type DurationWithRef = z.infer<typeof DurationWithRefSchema>;

export const DurationTokenSchema = z.union([ModernDurationTokenSchema, DurationWithRefSchema]);
export type DurationToken = z.infer<typeof DurationTokenSchema>;
