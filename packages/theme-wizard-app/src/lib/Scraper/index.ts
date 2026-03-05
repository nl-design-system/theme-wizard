import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';

const DEFAULT_SCRAPER_URL = '';
const CSS_ENDPOINT = '/api/v1/css';
const TOKEN_ENDPOINT = '/api/v1/css-design-tokens';

export default class Scraper {
  readonly #scraperUrl: URL;
  readonly #requestCSSUrl: URL;
  readonly #requestTokenUrl: URL;

  constructor(scraperURL = DEFAULT_SCRAPER_URL) {
    this.#scraperUrl = new URL(scraperURL);
    this.#requestCSSUrl = new URL(CSS_ENDPOINT, this.#scraperUrl);
    this.#requestTokenUrl = new URL(TOKEN_ENDPOINT, this.#scraperUrl);
  }

  async #get(endpoint: URL, url: URL) {
    endpoint.searchParams.set('url', url.toString());
    return fetch(endpoint);
  }

  // TODO: check if this method is actually used
  async getCSS(url: URL): Promise<string> {
    return this.#get(this.#requestCSSUrl, url).then((result) => result.text());
  }

  async getTokens(url: URL): Promise<ScrapedDesignToken[]> {
    const response = await this.#get(this.#requestTokenUrl, url);
    if (!response.ok) {
      throw new Error('Scraping design tokens failed');
    }
    return response.json();
  }
}
