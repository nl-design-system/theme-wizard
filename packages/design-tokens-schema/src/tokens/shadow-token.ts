import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
import { ColorValueSchema } from './color-token';
import { ModernDimensionValueSchema } from './dimension-token';
import { TokenReferenceSchema } from './token-reference';

// 9.6 Shadow

export const ShadowTypeSchema = z.literal('shadow');
export type ShadowType = z.infer<typeof ShadowTypeSchema>;

// Each shadow property is either an explicit value or a reference to a token of the matching type
const ShadowColorPropertySchema = z.union([ColorValueSchema, TokenReferenceSchema]);
const ShadowDimensionPropertySchema = z.union([ModernDimensionValueSchema, TokenReferenceSchema]);

export const ShadowValueSchema = z.strictObject({
  blur: ShadowDimensionPropertySchema,
  color: ShadowColorPropertySchema,
  inset: z.boolean().optional(),
  offsetX: ShadowDimensionPropertySchema,
  offsetY: ShadowDimensionPropertySchema,
  spread: ShadowDimensionPropertySchema,
});

/** @see https://www.designtokens.org/tr/2025.10/format/#shadow */
export type ShadowValue = z.infer<typeof ShadowValueSchema>;

// An array item is either an explicit shadow object or a reference to another shadow token.
// A reference resolves to a single shadow object, so arrays are never flattened.
const ShadowValueOrRefSchema = z.union([ShadowValueSchema, TokenReferenceSchema]);

export const ModernShadowValueSchema = z.union([ShadowValueSchema, z.array(ShadowValueOrRefSchema)]);

/** @see https://www.designtokens.org/tr/2025.10/format/#shadow */
export type ModernShadowValue = z.infer<typeof ModernShadowValueSchema>;

export const ModernShadowTokenSchema = z.strictObject({
  ...BaseDesignTokenSchema.shape,
  $type: ShadowTypeSchema,
  $value: ModernShadowValueSchema,
});

/** @see https://www.designtokens.org/tr/2025.10/format/#shadow */
export type ModernShadowToken = z.infer<typeof ModernShadowTokenSchema>;

export const ShadowWithRefSchema = z.object({
  ...BaseDesignTokenSchema.shape,
  $type: ShadowTypeSchema,
  $value: TokenReferenceSchema,
});
export type ShadowWithRef = z.infer<typeof ShadowWithRefSchema>;

export const ShadowTokenSchema = z.union([ModernShadowTokenSchema, ShadowWithRefSchema]);
export type ShadowToken = z.infer<typeof ShadowTokenSchema>;
