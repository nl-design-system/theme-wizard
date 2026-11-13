import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';

export const UPDATE_DESIGN_TOKENS_EVENT = 'update-design-tokens';

export type UpdateDesignTokensDetail = {
  tokens: { path: string; value: BaseDesignToken['$value'] }[];
  /** Group-level $extensions to set alongside the token updates, e.g. the color-scale seed. */
  groupSeeds?: { groupPath: string; seed: unknown }[];
};

export type SubmitSaveTokenFormEvent = CustomEvent<UpdateDesignTokensDetail>;

export const STEPS_COMPLETED_EVENT = 'steps-completed';

export type StepsCompletedDetail = {
  paths: string[];
};

export type StepsCompletedEvent = CustomEvent<StepsCompletedDetail>;

export const STAGE_SCRAPED_TOKEN_EVENT = 'stage-scraped-token';

export type StageScrapedTokenDetail = {
  id: string;
  staged: boolean;
};

export type StageScrapedTokenEvent = CustomEvent<StageScrapedTokenDetail>;

export const SET_THEME_TOKENS_EVENT = 'set-theme-tokens';

export type SetThemeTokensDetail = {
  tokens: Record<string, unknown>;
};

export type SetThemeTokensEvent = CustomEvent<SetThemeTokensDetail>;
