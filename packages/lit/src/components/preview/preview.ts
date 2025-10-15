import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import { fetchHtml, parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() scrapedCSS: string = '';
  @property() stylesheet: CSSStyleSheet | null = null;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';
  private readonly baseSheet = new CSSStyleSheet();
  private readonly mappingSheet = new CSSStyleSheet();

  static override readonly styles = [previewStyles];

  override connectedCallback() {
    super.connectedCallback();
  }

  override willUpdate(changedProps: Map<string | number | symbol, unknown>) {
    // Fetch content when URL changes (before render)
    if (changedProps.has('url') && this.url) {
      this.fetchContent();
    }

    if (changedProps.has('scrapedCSS') && this.scrapedCSS) {
      this.baseSheet.replaceSync(this.scrapedCSS);
      this.#adoptSheets();
    }
  }

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

  // Ensures both scraped CSS and theme stylesheet are applied in shadow DOM
  #adoptSheets(): void {
    const sheets: CSSStyleSheet[] = [];
    if (this.stylesheet) sheets.push(this.stylesheet);
    if (this.baseSheet) sheets.push(this.baseSheet);

    sheets.push(this.mappingSheet);

    const root = this.shadowRoot;
    if (root) {
      root.adoptedStyleSheets = sheets;
    }
  }

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

    return html` <div class="ma-theme" .innerHTML=${this.htmlContent}></div> `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
