import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './dtcg/base-token';

// 8.3 Font family

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
    $type: z.literal('fontFamilies'), // note: plural instead of singular
    $value: LegacyFontFamilyValueSchema,
  })
  // Transform to rename the $type to the modern format
  .transform((token) => {
    return {
      ...token,
      $type: 'fontFamily',
    };
  });
export type LegacyFontFamilyToken = z.infer<typeof LegacyFontFamilyTokenSchema>;

/** Sometimes legacy $value is mixed with modern $type */
export const MixedFontFamilyTokenSchema = z.object({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: LegacyFontFamilyValueSchema,
});
export type MixedFontFamilyToken = z.infer<typeof MixedFontFamilyTokenSchema>;
