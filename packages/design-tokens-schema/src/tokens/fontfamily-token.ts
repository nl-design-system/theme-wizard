import * as z from 'zod';
import { BaseDesignTokenSchema } from './base-token';
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

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type FontFamilyValue = z.infer<typeof ModernFontFamilyValueSchema>;

export const ModernFontFamilyTokenSchema = z.looseObject({
  ...BaseDesignTokenSchema.shape,
  $type: z.literal('fontFamily'),
  $value: ModernFontFamilyValueSchema,
});

/** @see https://www.designtokens.org/tr/drafts/format/#font-family */
export type ModernFontFamilyToken = z.infer<typeof ModernFontFamilyTokenSchema>;

export const splitFontFamily = (string: string): string[] => {
  return string.split(',').map((s) => s.trim().replaceAll(/(^['"])|(['"]$)/g, ''));
};

export const stringifyFontFamily = (value: FontFamilyValue): string => {
  if (!Array.isArray(value)) {
    return value;
  }
  const [last, ...names] = value.toReversed();
  return [GENERICS.has(last) ? last : `"${last}"`, ...names.map((name) => `"${name}"`)].reverse().join(',');
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
  decode: (value) => {
    const array = splitFontFamily(value);
    return array.length === 1 ? array[0] : array;
  },
  encode: (value) => stringifyFontFamily(value),
});

export const FontFamilyWithRefSchema = z.looseObject({
  ...BaseDesignTokenSchema.shape,
  $type: z.literal('fontFamily'),
  $value: TokenReferenceSchema,
});
export type FontFamilyWithRef = z.infer<typeof FontFamilyWithRefSchema>;

/** @description Validation schema for fontFamily tokens. Legacy formats are handled by preprocessing. */
export const FontFamilyTokenSchema = z.union([FontFamilyWithRefSchema, ModernFontFamilyTokenSchema]);
export type FontFamilyToken = z.infer<typeof FontFamilyTokenSchema>;
