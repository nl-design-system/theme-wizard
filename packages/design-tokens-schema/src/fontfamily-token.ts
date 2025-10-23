import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.3 Font family
// https://www.designtokens.org/tr/drafts/format/#font-family

// "The value MUST either be a string value containing a single font name or an array of strings, each being a single font name."
const FontFamilyNameSchema = z.custom<string>((value) => {
  if (typeof value !== 'string') return false;
  if (value.includes(',')) return false;
  return true;
});

export const FontFamilyValueSchema = z.union([FontFamilyNameSchema, z.array(FontFamilyNameSchema)]);
export type FontFamilyValue = z.infer<typeof FontFamilyValueSchema>;

export const FontFamilyTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValueSchema,
});
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
