import type { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { createContext } from '@lit/context';

/**
 * Context for scraped colors available to child components
 */
export const scrapedColorsContext = createContext<ScrapedColorToken[]>('scrapedColors');
