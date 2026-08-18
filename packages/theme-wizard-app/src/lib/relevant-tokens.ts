import { EXTENSION_CSS_PROPERTIES, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import {
  BaseDesignToken,
  isColorToken,
  isRef,
  stringifyToken,
  walkTokens,
} from '@nl-design-system-community/design-tokens-schema';
import type Theme from './Theme';
import { EXTENSION_TOKEN_STAGED, type StagedDesignToken } from '../utils/types';

export type RelevantTokensResult = {
  tokens: BaseDesignToken[];
  source: 'scraper' | 'theme';
};

/**
 * Filters tokens down to the ones matching subType, unless that would filter out everything,
 * in which case the original (unfiltered by subType) list is returned.
 */
const filterBySubType = <T extends BaseDesignToken>(tokens: T[], subType?: string): T[] => {
  if (!subType) {
    return tokens;
  }

  const subTypeTokens = tokens.filter((token) => {
    const cssProperties = token.$extensions?.[EXTENSION_CSS_PROPERTIES];
    return !Array.isArray(cssProperties) || cssProperties.includes(subType);
  });

  return subTypeTokens.length > 0 ? subTypeTokens : tokens;
};

const getStagedTokens = (
  scrapedTokens: StagedDesignToken[],
  type: BaseDesignToken['$type'],
  subType?: string,
): BaseDesignToken[] => {
  const stagedTypeTokens = scrapedTokens.filter(
    (token) => token.$extensions?.[EXTENSION_TOKEN_STAGED] === true && token.$type === type,
  );

  const filteredTokens = filterBySubType(stagedTypeTokens, subType);

  return filteredTokens.toSorted(
    (a, b) => (b.$extensions?.[EXTENSION_USAGE_COUNT] || 0) - (a.$extensions?.[EXTENSION_USAGE_COUNT] || 0),
  );
};

const getThemeTokens = (theme: Theme, type: BaseDesignToken['$type'], subType?: string): BaseDesignToken[] => {
  // Storing tokens in a Map so we get guaranteed unique values
  const typeTokens: Map<string, BaseDesignToken> = new Map();

  walkTokens(theme.tokens, (token) => {
    if (
      token.$type === type &&
      !isRef(token.$value) &&
      // Scraper filters out transparent colors, but theme.tokens may still contain them
      !(isColorToken(token) && token.$value.alpha !== undefined && token.$value.alpha < 1)
    ) {
      typeTokens.set(stringifyToken(token), token);
    }
  });

  return filterBySubType(Array.from(typeTokens.values()), subType);
};

/**
 * Prefers staged scraped tokens matching type/subType; falls back to relevant tokens
 * already present in the theme when nothing was staged for that type/subType.
 */
export const getRelevantTokens = (
  theme: Theme,
  scrapedTokens: StagedDesignToken[],
  type: BaseDesignToken['$type'],
  subType?: string,
): RelevantTokensResult => {
  const stagedTokens = getStagedTokens(scrapedTokens, type, subType);
  if (stagedTokens.length > 0) {
    return { source: 'scraper', tokens: stagedTokens };
  }
  return { source: 'theme', tokens: getThemeTokens(theme, type, subType) };
};
