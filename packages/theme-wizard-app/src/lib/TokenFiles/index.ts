import type { DesignTokens } from 'style-dictionary/types';
import {
  ERROR_CODES,
  StrictThemeSchema,
  excludeParentKeys,
  mergeTokens,
  preprocessThemeStrict,
  type Theme,
  type ThemeValidationIssue,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import { $ZodIssue } from 'zod/v4/core';
import { flattenTokens } from '../Theme/lib';

export type TokenFileResult = { success: true; data: Theme } | { success: false; error: $ZodIssue[] };

export type ThemePresetResult =
  | {
      success: true;
      data: Theme;
      /** Token paths present in `data` but missing from the uploaded file(s), filled in from the Start-thema defaults. */
      filledFromDefaultsPaths: string[];
      softIssues: $ZodIssue[];
      uploadedTokenCount: number;
    }
  | { success: false; error: $ZodIssue[] };

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

// Cosmetic/threshold issues that shouldn't block a theme preset upload, unlike
// structural issues (invalid refs, wrong types, invalid subtypes).
const SOFT_ERROR_CODES: ReadonlySet<string> = new Set([
  ERROR_CODES.INSUFFICIENT_CONTRAST,
  ERROR_CODES.FONT_SIZE_TOO_SMALL,
  ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
]);

/**
 * Like `parseTokenFiles`, but for theme presets: missing tokens are filled in from
 * the Start-thema defaults, and cosmetic/threshold issues (contrast, font-size,
 * line-height) don't block the upload — only structural issues do.
 */
export async function parseThemePreset(files: File[], shouldExcludeParentKeys: boolean): Promise<ThemePresetResult> {
  const uploaded = await readTokenFiles(files, shouldExcludeParentKeys);
  const uploadedPaths = new Set(Object.keys(flattenTokens(uploaded as DesignTokens)));
  const merged = mergeTokens([startTokens, uploaded]);

  const toResult = (data: Theme, softIssues: $ZodIssue[]): ThemePresetResult => ({
    data,
    filledFromDefaultsPaths: Object.keys(flattenTokens(data as DesignTokens)).filter(
      (path) => !uploadedPaths.has(path),
    ),
    softIssues,
    success: true,
    uploadedTokenCount: uploadedPaths.size,
  });

  const parsed = StrictThemeSchema.safeParse(merged);
  if (parsed.success) {
    return toResult(parsed.data, []);
  }

  const hardIssues = parsed.error.issues.filter(
    (issue) => !SOFT_ERROR_CODES.has((issue as ThemeValidationIssue).ERROR_CODE ?? ''),
  );
  if (hardIssues.length > 0) {
    return { error: hardIssues, success: false };
  }

  // Only soft issues remain, so shape/refs/types already passed. `safeParse` withholds
  // `.data` whenever any superRefine issue fires (soft or not), so re-derive the
  // processed tree ourselves via the same transform `StrictThemeSchema` pipes through.
  return toResult(preprocessThemeStrict(merged) as Theme, parsed.error.issues);
}
