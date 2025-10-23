import * as z from 'zod';

// 5.1 Name and value
// https://www.designtokens.org/tr/drafts/format/#name-and-value
export const BaseDesignTokenNameSchema = z.custom<string>((value) => {
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
});
export type BaseDesignTokenName = z.infer<typeof BaseDesignTokenNameSchema>;

export const BaseDesignTokenValueSchema = z.strictObject({
  // 5.2.4 Deprecated https://www.designtokens.org/tr/drafts/format/#deprecated
  $deprecated: z.union([z.boolean(), z.string()]).optional(),
  // 5.2.1 Description https://www.designtokens.org/tr/drafts/format/#description
  $description: z.string().optional(),
  // 5.2.3 Extensions https://www.designtokens.org/tr/drafts/format/#extensions
  $extensions: z.record(z.string(), z.unknown()).optional(),
  // 5.2.2 Type https://www.designtokens.org/tr/drafts/format/#type-0
  $type: z.string().optional(),
  $value: z.unknown().nonoptional(), // refine exact shape in concrete token types
});
export type BaseDesignTokenValue = z.infer<typeof BaseDesignTokenValueSchema>;

export const BaseDesignTokenSchema = z.record(BaseDesignTokenNameSchema, BaseDesignTokenValueSchema);
export type BaseDesignToken = z.infer<typeof BaseDesignTokenSchema>;
