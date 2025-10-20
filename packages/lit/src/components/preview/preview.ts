import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import Scraper from '../../lib/Scraper';
import { fetchHtml, parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() scrapedCSS: string = '';
  @property({ hasChanged: () => true })
  previewStylesheet: CSSStyleSheet = new CSSStyleSheet();
  private readonly scraper: Scraper;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';
  private readonly baseSheet = new CSSStyleSheet();
  private readonly mappingSheet = new CSSStyleSheet();

  static override readonly styles = [previewStyles];

  constructor() {
    super();
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '';
    this.scraper = new Scraper(scraperURL);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.fetchContent();
    this.#loadInitialCSS();

    this.shadowRoot?.adoptedStyleSheets.push(this.previewStylesheet);
  }
  // override updated(changedProps: Map<string | number | symbol, unknown>) {
  //   super.updated(changedProps);

  //   // Log computed styles after the DOM has been updated
  //   if (changedProps.has('stylesheet')) {
  //     const element = this.shadowRoot?.querySelector('.nl-heading--level-1');
  //     if (element) {
  //       const computedStyle = getComputedStyle(element);
  //       console.log('Heading styles:', {
  //         'font-family': computedStyle.getPropertyValue('font-family'),
  //         '--basis-heading-font-family': computedStyle.getPropertyValue('--basis-heading-font-family'),
  //       });
  //     }
  //   }
  // }

  readonly #loadInitialCSS = async () => {
    const url = new URL(DEFAULT_CONFIG.previewUrl);
    this.scrapedCSS = await this.scraper.getCSS(url);
    this.previewStylesheet?.replaceSync(this.scrapedCSS);
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

    return html` <div class="theme-wizard-preview" .innerHTML=${this.htmlContent}></div> `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
