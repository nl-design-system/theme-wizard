import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import { parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import previewStyles from './preview.css';

export const PREVIEW_THEME = 'preview-theme';
const previewTheme = maTheme.replace('.ma-theme', `.${PREVIEW_THEME}`);

interface TemplateConfig {
  htmlUrl: string;
}

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() themeStylesheet!: CSSStyleSheet;
  @property({ type: Object }) templateConfig?: TemplateConfig;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  previewStylesheet: CSSStyleSheet = new CSSStyleSheet();

  // TODO: Drop injection of maTheme and generate a full wizard theme CSS
  static override readonly styles = [previewStyles, unsafeCSS(previewTheme)];

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
    const config: TemplateConfig | null =
      this.templateConfig ?? (this.url ? { cssUrl: this.url, htmlUrl: this.url } : null);

    if (!config) return;

    this.isLoading = true;
    this.error = '';

    try {
      const { bodyHTML, fullHTML } = await this.#fetchHTML(config.htmlUrl);
      this.htmlContent = bodyHTML;

      const inlinedCss = await this.#extractStylesFromHTML(fullHTML);
      if (inlinedCss && inlinedCss.trim().length > 0) {
        this.previewStylesheet?.replaceSync(inlinedCss);
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
  readonly #fetchHTML = async (url: string): Promise<{ bodyHTML: string; fullHTML: string }> => {
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
