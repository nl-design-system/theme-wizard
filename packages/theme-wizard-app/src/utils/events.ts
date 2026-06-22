import type { DesignToken } from 'style-dictionary/types';

export const UPDATE_DESIGN_TOKENS_EVENT = 'update-design-tokens';

export type UpdateDesignTokensDetail = {
  path: string;
  value: DesignToken['$value'];
}[];

export type SubmitSaveTokenFormEvent = CustomEvent<UpdateDesignTokensDetail>;
