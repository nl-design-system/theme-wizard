import type { PropertyValues } from 'lit';
import { consume } from '@lit/context';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import Scraper from '../../lib/Scraper';
import { PREVIEW_THEME_CLASS } from '../../lib/Theme';
import { parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../utils';
import styles from './styles';

const tag = 'wizard-preview';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ThemePreview;
  }
}

@customElement(tag)
export class ThemePreview extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme!: Theme;

  @property() url?: string;
  @property() scraperUrl?: string;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  private scraper?: Scraper;
  previewStylesheet: CSSStyleSheet = new CSSStyleSheet();

  static override readonly styles = [styles];

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    // Only load if url is already set
    if (this.url) {
      this.scraper = new Scraper(this.scraperUrl);
      this.#loadContent();
    }

    // Make sure the newly set token --basis-heading-font-family is applied to the scraped CSS in the preview
    this.shadowRoot?.adoptedStyleSheets.push(this.previewStylesheet, this.theme.stylesheet);
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Reload content when url changes
    if (changedProperties.has('url') && this.url) {
      this.#loadContent();
    }

    // Execute scripts after content is rendered
    if (changedProperties.has('htmlContent') && this.htmlContent) {
      requestAnimationFrame(() => {
        const container = this.shadowRoot?.querySelector(`[data-testid="preview"]`) as HTMLElement;
        if (container) {
          this.#executeScripts(container);
        }
      });
    }
  }

  get previewUrl() {
    return `/templates${this.url || ''}`;
  }

  readonly #loadContent = async () => {
    this.isLoading = true;
    this.error = '';

    try {
      this.htmlContent = await this.#fetchHTML();
      const css = await this.#fetchCSS();

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

  readonly #fetchCSS = async (): Promise<string | undefined> => {
    try {
      // Internal template page: resolve to our templates route
      const targetUrl = new URL(this.previewUrl, globalThis.location.href);
      return await this.scraper?.getCSS(targetUrl);
    } catch (err) {
      console.error('Failed to fetch CSS:', err);
      return undefined;
    }
  };

  /**
   * Execute scripts from the fetched HTML
   */
  readonly #executeScripts = (container: HTMLElement) => {
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');

      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Copy inline script content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      // Replace old script with new one (this makes it execute)
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  };

  /**
   * Fetch and process HTML from the URL
   */
  readonly #fetchHTML = async (): Promise<string> => {
    const response = await fetch(this.previewUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${this.previewUrl}: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = parseHtml(html);

    rewriteAttributeUrlsToAbsolute(doc.body, this.previewUrl);
    rewriteSvgXlinkToAbsolute(doc.body, this.previewUrl);

    return doc.body.innerHTML;
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

    return html` <div class=${PREVIEW_THEME_CLASS} data-testid="preview" .innerHTML=${this.htmlContent}></div> `;
  }
}
