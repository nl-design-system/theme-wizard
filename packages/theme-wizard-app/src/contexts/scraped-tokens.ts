import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { createContext } from '@lit/context';

/**
 * Context for scraped colors available to child components
 */
export const scrapedTokensContext = createContext<ScrapedDesignToken[]>('scrapedTokens');
