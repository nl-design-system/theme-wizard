import paragraphCss from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import Scraper from '../../lib/Scraper';
import { parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

export const PREVIEW_THEME = 'preview-theme';
const previewTheme = maTheme.replace('.ma-theme', `.${PREVIEW_THEME}`);

interface TemplateConfig {
  htmlUrl: string;
  cssUrl?: string;
}

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() themeStylesheet!: CSSStyleSheet;
  @property({ type: Object }) templateConfig?: TemplateConfig;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  private readonly scraper: Scraper;
  previewStylesheet: CSSStyleSheet = new CSSStyleSheet();

  // TODO: Drop injection of maTheme and generate a full wizard theme CSS
  static override readonly styles = [previewStyles, unsafeCSS(previewTheme), unsafeCSS(paragraphCss)];

  constructor() {
    super();
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '';
    this.scraper = new Scraper(scraperURL);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#loadContent();

    // Make sure the newly set token --basis-heading-font-family is applied to the scraped CSS in the preview
    this.shadowRoot?.adoptedStyleSheets.push(this.previewStylesheet, this.themeStylesheet);
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties);

    // Reload content when template config or URL changes
    if (changedProperties.has('templateConfig')) {
      this.#loadContent();
    }
  }

  readonly #loadContent = async () => {
    const config: TemplateConfig | null = this.templateConfig
      ? this.templateConfig
      : this.url
        ? { cssUrl: this.url, htmlUrl: this.url }
        : null;

    if (!config) return;

    this.isLoading = true;
    this.error = '';

    try {
      this.htmlContent = await this.#fetchHTML(config.htmlUrl);

      if (config.cssUrl) {
        const cssContent = await this.#fetchCSS(config.cssUrl);
        this.previewStylesheet?.replaceSync(cssContent);
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load content';
    } finally {
      this.isLoading = false;
    }
  };

  /**
   * Fetch and process HTML from the URL
   */
  readonly #fetchHTML = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = parseHtml(html);

    rewriteAttributeUrlsToAbsolute(doc.body, url);
    rewriteSvgXlinkToAbsolute(doc.body, url);

    return doc.body.innerHTML;
  };

  /**
   * Fetch CSS from a URL (local or remote)
   */
  readonly #fetchCSS = async (url: string): Promise<string> => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://');

    if (isExternal) {
      // Use scraper API for external URLs to bypass CORS
      const cssUrl = new URL(url);
      return this.scraper.getCSS(cssUrl);
    } else {
      // Direct fetch for local/relative URLs
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSS: ${response.statusText}`);
      }
      return response.text();
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

    return html` <div class="preview-theme" data-testid="preview" .innerHTML=${this.htmlContent}></div> `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
