import { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';

export const EXTENSION_TOKEN_STAGED = 'nl.nldesignsystem.theme-wizard.token-staged';

export type StagedDesignToken = ScrapedDesignToken & {
  $extensions: {
    [EXTENSION_TOKEN_STAGED]: boolean;
  };
};
