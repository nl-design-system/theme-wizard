import { createContext } from '@lit/context';
import { StagedDesignToken } from '../utils/types';

/**
 * Context for scraped tokens available to child components
 */
export const scrapedTokensContext = createContext<StagedDesignToken[]>('scrapedTokens');
