import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.3 Font family

// "The value MUST either be a string value containing a single font name or an array of strings, each being a single font name."
export const ModernFontFamilyNameSchema = z.custom<string>((value) => {
  if (typeof value !== 'string') return false;
  if (value.includes(',')) return false;
  return value.trim().length > 0;
}, 'Invalid font family (family names must not include `,` and must not be empty)');
export type ModernFontFamilyName = z.infer<typeof ModernFontFamilyNameSchema>;

export const ModernFontFamilyValueSchema = z.union([ModernFontFamilyNameSchema, z.array(ModernFontFamilyNameSchema)]);

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyValue = z.infer<typeof ModernFontFamilyValueSchema>;

export const ModernFontFamilyTokenSchema = z.looseObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: ModernFontFamilyValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type ModernFontFamilyToken = z.infer<typeof ModernFontFamilyTokenSchema>;

const splitFamily = (str: string): string[] => {
  return str.split(',').map((s) => s.trim());
};

export const LegacyFontFamilyValueSchema = z
  .string()
  .trim()
  .nonempty()
  .refine((value) => splitFamily(value).every((s) => s.length > 0), 'Font-family names must have 1 or more characters')
  .transform((value) => splitFamily(value));
export type LegacyFontFamilyValue = z.infer<typeof LegacyFontFamilyValueSchema>;

export const LegacyFontFamilyTokenSchema = z
  .object({
    ...BaseDesignTokenValueSchema.shape,
    $type: z.literal('fontFamilies'), // plural
    $value: LegacyFontFamilyValueSchema,
  })
  // Transform to rename the $type to the modern format
  .transform((token) => ({
    ...token,
    $type: 'fontFamily', // override `$type` when it exists in `token`
  }));
export type LegacyFontFamilyToken = z.infer<typeof LegacyFontFamilyTokenSchema>;

/** Sometimes legacy $value is mixed with modern $type */
export const MixedFontFamilyTokenSchema = z.object({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: LegacyFontFamilyValueSchema,
});
export type MixedFontFamilyToken = z.infer<typeof MixedFontFamilyTokenSchema>;

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
  ModernFontFamilyTokenSchema,
]);
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
