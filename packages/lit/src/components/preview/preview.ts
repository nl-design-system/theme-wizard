import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import Scraper from '../../lib/Scraper';
import { fetchHtml, parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

export const PREVIEW_THEME = '.preview-theme';
const previewTheme = maTheme.replace('.ma-theme', PREVIEW_THEME);

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() themeStylesheet!: CSSStyleSheet;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  private readonly scraper: Scraper;
  private scrapedCSS: string = '';
  previewStylesheet: CSSStyleSheet = new CSSStyleSheet();

  // TODO: Drop injection of maTheme and generate a full wizard theme CSS
  static override readonly styles = [previewStyles, unsafeCSS(previewTheme)];

  constructor() {
    super();
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '';
    this.scraper = new Scraper(scraperURL);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.fetchContent();
    this.#loadInitialCSS();
    this.#adoptStylesheets();
  }

  /**
   * Load the initial CSS from the preview URL and set it to the preview stylesheet
   */
  readonly #loadInitialCSS = async () => {
    const url = new URL(DEFAULT_CONFIG.previewUrl);
    this.scrapedCSS = await this.scraper.getCSS(url);
    this.previewStylesheet?.replaceSync(this.scrapedCSS);
  };

  /** Make sure the newly set token --basis-heading-font-family is applied to the scraped CSS in the preview */
  readonly #adoptStylesheets = () => {
    const adoptedStylesheets = [this.previewStylesheet, this.themeStylesheet];
    this.shadowRoot?.adoptedStyleSheets.push(...adoptedStylesheets);
  };

  /**
   * Fetch the content from the URL
   */
  private readonly fetchContent = async () => {
    this.isLoading = true;
    this.error = '';

    if (!this.url) {
      this.isLoading = false;
      return;
    }

    try {
      const html = await fetchHtml(this.url);
      const doc = parseHtml(html);

      rewriteAttributeUrlsToAbsolute(doc.body, this.url);
      rewriteSvgXlinkToAbsolute(doc.body, this.url);

      this.htmlContent = doc.body.innerHTML;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load content';
    } finally {
      this.isLoading = false;
    }
  };

  override render() {
    if (this.isLoading && !this.htmlContent) {
      return html`
        <div>
          <p>Laden...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div>
          <p>Error: ${this.error}</p>
        </div>
      `;
    }

    return html` <div class="preview-theme" .innerHTML=${this.htmlContent}></div> `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
