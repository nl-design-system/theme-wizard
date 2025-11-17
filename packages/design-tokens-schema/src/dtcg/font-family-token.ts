import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.3 Font family

// "The value MUST either be a string value containing a single font name or an array of strings, each being a single font name."
export const FontFamilyNameSchema = z.custom<string>((value) => {
  if (typeof value !== 'string') return false;
  if (value.includes(',')) return false;
  return value.trim().length > 0;
}, 'Invalid font family (family names must not include `,` and must not be empty)');
export type ModernFontFamilyName = z.infer<typeof FontFamilyNameSchema>;

export const FontFamilyValueSchema = z.union([FontFamilyNameSchema, z.array(FontFamilyNameSchema)]);

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyValue = z.infer<typeof FontFamilyValueSchema>;

export const FontFamilyTokenSchema = z.looseObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: FontFamilyValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
