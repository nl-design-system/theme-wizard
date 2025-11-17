import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './dtcg/base-token';
import { FontFamilyTokenSchema as DTCGFontFamilyTokenSchema } from './dtcg/font-family-token';
import { TokenReferenceSchema } from './dtcg/token-ref';
import { LegacyFontFamilyTokenSchema, MixedFontFamilyTokenSchema } from './font-family-legacy';

export const FontFamilyWithRefSchema = z.looseObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: TokenReferenceSchema,
});
export type FontFamilyWithRef = z.infer<typeof FontFamilyWithRefSchema>;

export const FontFamilyTokenSchema = z.union([
  FontFamilyWithRefSchema,
  LegacyFontFamilyTokenSchema,
  MixedFontFamilyTokenSchema,
  DTCGFontFamilyTokenSchema,
]);
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
