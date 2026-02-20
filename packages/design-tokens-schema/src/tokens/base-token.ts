import * as z from 'zod';

/** @see 5.2.3 Extensions https://www.designtokens.org/tr/drafts/format/#extensions */
export const ExtensionsSchema = z.record(z.string(), z.unknown());
export type Extensions = z.infer<typeof ExtensionsSchema>;

// 5.1 Name and value

export const BaseDesignTokenIdentifierSchema = z.custom<string>((value) => {
  // 5.1 A token's name MUST be a valid JSON string as defined in [RFC8259].
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;

  // 5.1.1 Character restrictions
  // The following characters MUST NOT be used anywhere in a token or group name:
  // { (left curly bracket)
  // } (right curly bracket)
  // . (period)
  for (const forbiddenCharacter of ['{', '}', '.']) {
    if (trimmed.includes(forbiddenCharacter)) return false;
  }

  // 5.1.1 names MUST NOT begin with the $ character.
  if (trimmed.startsWith('$')) return false;

  return true;
}, 'Design Token identifiers must be at least 1 character long and must not contain {, } or . and must not start with $');

/** @see https://www.designtokens.org/tr/drafts/format/#name-and-value */
export type BaseDesignTokenIdentifier = z.infer<typeof BaseDesignTokenIdentifierSchema>;

export const BaseDesignTokenValueSchema = z.strictObject({
  /** @see 5.2.4 Deprecated https://www.designtokens.org/tr/drafts/format/#deprecated */
  $deprecated: z.union([z.boolean(), z.string()]).optional(),
  /** @see 5.2.1 Description https://www.designtokens.org/tr/drafts/format/#description */
  $description: z.string().optional(),
  /** @see 5.2.3 Extensions https://www.designtokens.org/tr/drafts/format/#extensions */
  $extensions: ExtensionsSchema.optional(),
  /** @see 5.2.2 Type https://www.designtokens.org/tr/drafts/format/#type-0 */
  $type: z.string().nonoptional(),
  $value: z.unknown().nonoptional(), // refine exact shape in concrete token types
});
export type BaseDesignTokenValue = z.infer<typeof BaseDesignTokenValueSchema>;

const BaseDesignTokenPropertiesEnum = BaseDesignTokenValueSchema.keyof();
export type BaseDesignTokenProperty = z.infer<typeof BaseDesignTokenPropertiesEnum>;
export const BASE_DESIGN_TOKEN_PROPERTIES = BaseDesignTokenPropertiesEnum.options;

export const BaseDesignTokenSchema = z.record(BaseDesignTokenIdentifierSchema, BaseDesignTokenValueSchema);

/** @see https://www.designtokens.org/tr/drafts/format/#design-token-0 */
export type BaseDesignToken = z.infer<typeof BaseDesignTokenSchema>;
