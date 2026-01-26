import * as z from 'zod';
import { BaseDesignTokenValueSchema } from './base-token';
import { TokenReferenceSchema } from './token-reference';

// 8.3 Font family

/**
 * Generic family names are keywords and must not be quoted.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family
 */
const GENERICS = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'fangsong',
]);

// "The value MUST either be a string value containing a single font name or an array of strings, each being a single font name."
export const ModernFontFamilyNameSchema = z.custom<string>((value) => {
  if (typeof value !== 'string') return false;
  if (value.includes(',')) return false;
  return value.trim().length > 0;
}, 'Invalid font family (family names must not include `,` and must not be empty)');
export type ModernFontFamilyName = z.infer<typeof ModernFontFamilyNameSchema>;

export const ModernFontFamilyValueSchema = z.union([ModernFontFamilyNameSchema, z.array(ModernFontFamilyNameSchema)]);

export const parseFontFamily = (string: string): string[] => {
  return string.split(',').map((s) => s.trim().replaceAll(/(^['"])|(['"]$)/g, ''));
};

export const stringifyFontFamily = (value: FontFamilyValue): string => {
  if (!Array.isArray(value)) {
    return value;
  }
  const [generic, ...fontNames] = value.toReversed();
  return [GENERICS.has(generic) ? generic : `"${generic}"`, ...fontNames.map((name) => `"${name}"`)]
    .reverse()
    .join(',');
};

/**
 * @description Convert back and forth between a legacy font family value and a modern value
 * @example
 * ```ts
 * legacyToModernFontFamily.decode(`"Roboto Sans", sans-serif`);
 * //=> ['Roboto Sans', 'sans-serif']
 *
 * legacyToModernFontFamily.encode(['Roboto Sans', 'sans-serif'])
 * //=> `"Roboto Sans", sans-serif`
 * ```
 */
export const legacyToModernFontFamily = z.codec(z.string(), ModernFontFamilyValueSchema, {
  decode: (value) => parseFontFamily(value),
  encode: (value) => stringifyFontFamily(value),
});

export const LegacyFontFamilyValueSchema = z
  .string()
  .trim()
  .nonempty()
  .transform((value) => legacyToModernFontFamily.decode(value))
  .refine(
    (value) => (Array.isArray(value) ? value.every((s) => s.length > 0) : value.length > 0),
    'Font-family names must have 1 or more characters',
  );
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

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyValue = z.infer<typeof ModernFontFamilyValueSchema>;

export const ModernFontFamilyTokenSchema = z.looseObject({
  ...BaseDesignTokenValueSchema.shape,
  $type: z.literal('fontFamily'),
  $value: ModernFontFamilyValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type ModernFontFamilyToken = z.infer<typeof ModernFontFamilyTokenSchema>;

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
