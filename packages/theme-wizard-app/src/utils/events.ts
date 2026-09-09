import type { DesignToken } from 'style-dictionary/types';

export const UPDATE_DESIGN_TOKENS_EVENT = 'update-design-tokens';

export type UpdateDesignTokensDetail = {
  tokens: { path: string; value: DesignToken['$value'] }[];
  /** Group-level $extensions to set alongside the token updates, e.g. the color-scale seed. */
  groupSeeds?: { groupPath: string; seed: unknown }[];
};

export type SubmitSaveTokenFormEvent = CustomEvent<UpdateDesignTokensDetail>;
