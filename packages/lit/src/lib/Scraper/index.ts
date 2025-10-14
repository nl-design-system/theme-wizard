const DEFAULT_SCRAPER_URL = '';
const CSS_ENDPOINT = '/api/v1/css';
const TOKEN_ENDPOINT = '/api/v1/css-design-tokens';

export type DesignToken = {
  $type: string;
  $value: string | string[] | number;
  $extensions: Record<string, string>;
};

export type TokenTree = Record<string, Record<string, DesignToken>>;

export default class Scraper {
  #scraperUrl: URL;
  #requestCssUrl: URL;
  #requestTokenUrl: URL;

  constructor(scraperURL = DEFAULT_SCRAPER_URL) {
    this.#scraperUrl = new URL(scraperURL);
    this.#requestCssUrl = new URL(CSS_ENDPOINT, this.#scraperUrl);
    this.#requestTokenUrl = new URL(TOKEN_ENDPOINT, this.#scraperUrl);
  }

  async #get(endpoint: URL, url: URL) {
    endpoint.searchParams.append('url', url.toString());
    return fetch(endpoint);
  }

  async getCss(url: URL): Promise<string> {
    return this.#get(this.#requestCssUrl, url).then((result) => result.text());
  }

  async getTokens(url: URL): Promise<TokenTree> {
    return this.#get(this.#requestTokenUrl, url).then((result) => result.json());
  }
}
