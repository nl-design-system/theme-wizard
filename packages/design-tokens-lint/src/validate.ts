import { excludeParentKeys, StrictThemeSchema } from '@nl-design-system-community/design-tokens-schema';

type ParseSuccess = Extract<ReturnType<typeof StrictThemeSchema.safeParse>, { success: true }>;
type ParseFailure = Extract<ReturnType<typeof StrictThemeSchema.safeParse>, { success: false }>;

export type ValidateOptions = {
  excludeParentKeys?: boolean;
};

export type ValidateResult =
  | { success: true; data: ParseSuccess['data'] }
  | { success: false; issues: ParseFailure['error']['issues'] };

export function validateTokens(tokens: unknown, options: ValidateOptions = {}): ValidateResult {
  const processed = options.excludeParentKeys ? excludeParentKeys(tokens as Record<string, unknown>) : tokens;
  const result = StrictThemeSchema.safeParse(processed);
  if (result.success) {
    return { data: result.data, success: true };
  }
  return { issues: result.error.issues, success: false };
}
