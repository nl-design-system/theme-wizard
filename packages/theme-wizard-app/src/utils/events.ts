import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';

export const UPDATE_DESIGN_TOKENS_EVENT = 'update-design-tokens';

export type UpdateDesignTokensDetail = {
  // `type` is only needed for tokens the theme doesn't have yet
  tokens: { path: string; value: BaseDesignToken['$value']; type?: string }[];
  /** Group-level $extensions to set alongside the token updates, e.g. the color-scale seed. */
  groupSeeds?: { groupPath: string; seed: unknown }[];
};

export type SubmitSaveTokenFormEvent = CustomEvent<UpdateDesignTokensDetail>;

export const SET_THEME_TOKENS_EVENT = 'set-theme-tokens';

export type SetThemeTokensDetail = {
  tokens: Record<string, unknown>;
};

export type SetThemeTokensEvent = CustomEvent<SetThemeTokensDetail>;
