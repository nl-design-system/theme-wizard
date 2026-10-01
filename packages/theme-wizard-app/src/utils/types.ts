import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { EXTENSION_TOKEN_STAGED } from '@nl-design-system-community/design-tokens-schema';

export type StagedDesignToken = ScrapedDesignToken & {
  $extensions: {
    [EXTENSION_TOKEN_STAGED]: boolean;
  };
};
