import { StrictThemeSchema, excludeParentKeys, mergeTokens } from '@nl-design-system-community/design-tokens-schema';
import { $ZodIssue } from 'zod/v4/core';

export type TokenFileResult = { success: true; data: unknown } | { success: false; error: $ZodIssue[] };

export async function parseTokenFiles(files: File[], shouldExcludeParentKeys: boolean): Promise<TokenFileResult> {
  const fileTexts = await Promise.all(files.map((file) => file.text()));
  const tokenGroups = fileTexts.map((text) => JSON.parse(text));
  let tokens = mergeTokens(tokenGroups);
  if (shouldExcludeParentKeys) {
    tokens = excludeParentKeys(tokens);
  }
  const parsed = StrictThemeSchema.safeParse(tokens);
  return parsed.success ? { data: parsed.data, success: true } : { error: parsed.error.issues, success: false };
}
