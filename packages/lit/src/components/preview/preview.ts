import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import Scraper from '../../lib/Scraper';
import { parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

export const PREVIEW_THEME = 'preview-theme';
const previewTheme = maTheme.replace('.ma-theme', `.${PREVIEW_THEME}`);

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() themeStylesheet!: CSSStyleSheet;
  @property() templateUrl?: string;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  private readonly scraper: Scraper;
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
    this.#loadContent();

    // Make sure the newly set token --basis-heading-font-family is applied to the scraped CSS in the preview
    this.shadowRoot?.adoptedStyleSheets.push(this.previewStylesheet, this.themeStylesheet);
  }

  readonly #loadContent = async () => {
    const config: TemplateConfig | null =
      this.templateConfig ?? (this.url ? { cssUrl: this.url, htmlUrl: this.url } : null);

    if (!config) return;
    const url = this.templateUrl;
    if (!url) return;

    this.isLoading = true;
    this.error = '';

    try {
      this.htmlContent = await this.#fetchHTML(url);
      const css = await this.#fetchCSS(url);

      this.previewStylesheet?.replaceSync('');
      if (css?.trim()) {
        this.previewStylesheet.replaceSync(css);
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load content';
    } finally {
      this.isLoading = false;
    }
  };

  readonly #fetchCSS = async (url: string): Promise<string | undefined> => {
    try {
      const absoluteUrl = new URL(url, globalThis.location.href).href;
      const currentOrigin = new URL(globalThis.location.href).origin;
      const urlOrigin = new URL(absoluteUrl).origin;
      const isExternal = currentOrigin !== urlOrigin;

      const urlToFetch = isExternal ? new URL(url) : new URL(url, globalThis.location.href);
      return await this.scraper.getCSS(urlToFetch);
    } catch (err) {
      console.error('Failed to fetch CSS:', err);
      return undefined;
    }
  };

  /**
   * Fetch and process HTML from the URL
   */
  readonly #fetchHTML = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = parseHtml(html);

    rewriteAttributeUrlsToAbsolute(doc.body, url);
    rewriteSvgXlinkToAbsolute(doc.body, url);

    return { bodyHTML: doc.body.innerHTML, fullHTML: html };
  };

  /**
   * Extract CSS from HTML content: collects <style> tags from head/body and inlines same-origin <link rel="stylesheet">.
   * This enables templates to ship a single built HTML file containing or referencing its CSS.
   */
  readonly #extractStylesFromHTML = async (fullHtml: string): Promise<string> => {
    try {
      // External URL gets ignored since it's already absolute
      const absoluteUrl = new URL(url, globalThis.location.href).href;
      const currentOrigin = new URL(globalThis.location.href).origin;
      const urlOrigin = new URL(absoluteUrl).origin;
      const isExternal = currentOrigin !== urlOrigin;

      if (isExternal) {
        // Use scraper API
        const cssUrl = new URL(url);
        return this.scraper.getCSS(cssUrl);
      } else {
        // Direct fetch for local/relative URLs
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
      }

      return styles.join('\n');
    } catch {
      return '';
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

    return html` <div class=${PREVIEW_THEME} data-testid="preview" .innerHTML=${this.htmlContent}></div> `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
