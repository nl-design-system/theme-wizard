import {
  StrictThemeSchema,
  excludeParentKeys,
  mergeTokens,
  type Theme,
} from '@nl-design-system-community/design-tokens-schema';
import { $ZodIssue } from 'zod/v4/core';

export type TokenFileResult = { success: true; data: Theme } | { success: false; error: $ZodIssue[] };

export async function readTokenFiles(files: File[], shouldExcludeParentKeys: boolean) {
  const fileTexts = await Promise.all(files.map((file) => file.text()));
  const tokenGroups = fileTexts.map((text) => JSON.parse(text));
  let tokens = mergeTokens(tokenGroups);
  if (shouldExcludeParentKeys) {
    tokens = excludeParentKeys(tokens);
  }
  return tokens;
}

export async function parseTokenFiles(files: File[], shouldExcludeParentKeys: boolean): Promise<TokenFileResult> {
  const tokens = await readTokenFiles(files, shouldExcludeParentKeys);
  const parsed = StrictThemeSchema.safeParse(tokens);
  return parsed.success ? { data: parsed.data, success: true } : { error: parsed.error.issues, success: false };
}
