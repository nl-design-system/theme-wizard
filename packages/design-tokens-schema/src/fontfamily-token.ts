import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';

// 8.3 Font family

const splitFamily = (str: string): string[] => {
  return str.split(',').map((s) => s.trim());
};

export const LegacyFontFamilyValueSchema = z
  .string()
  .trim()
  .nonempty()
  .refine((value) => splitFamily(value).every((s) => s.length > 0))
  .transform((value) => splitFamily(value));
export type LegacyFontFamilyValue = z.infer<typeof LegacyFontFamilyValueSchema>;

export const LegacyFontFamilyTokenSchema = z
  .strictObject({
    ...BaseDesignTokenValueSchema.shape,
    $type: z.literal('fontFamilies'), // plural
    $value: LegacyFontFamilyValueSchema,
  })
  // Transform to rename the $type to the modern format
  .transform((token) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $type, ...rest } = token;
    return {
      $type: 'fontFamily',
      ...rest,
    };
  });
export type LegacyFontFamilyToken = z.infer<typeof LegacyFontFamilyTokenSchema>;

// "The value MUST either be a string value containing a single font name or an array of strings, each being a single font name."
export const ModernFontFamilyNameSchema = z.custom<string>((value) => {
  if (typeof value !== 'string') return false;
  if (value.includes(',')) return false;
  return value.trim().length > 0;
});
export type ModernFontFamilyName = z.infer<typeof ModernFontFamilyNameSchema>;

export const ModernFontFamilyValueSchema = z.union([ModernFontFamilyNameSchema, z.array(ModernFontFamilyNameSchema)]);

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyValue = z.infer<typeof ModernFontFamilyValueSchema>;

export const ModernFontFamilyTokenSchema = z.strictObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: ModernFontFamilyValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type ModernFontFamilyToken = z.infer<typeof ModernFontFamilyTokenSchema>;

export const FontFamilyTokenSchema = z.union([LegacyFontFamilyTokenSchema, ModernFontFamilyTokenSchema]);
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
