import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import {
  extractThemeProperties,
  fetchHtml,
  getThemeStyleString,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
} from '../../utils';
import previewStyles from './preview.css';

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.previewUrl;
  @property() stylesheet: CSSStyleSheet = new CSSStyleSheet();

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  override firstUpdated() {
    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets = [this.stylesheet];
    } else {
      throw new Error('Adopted stylesheets only work on (shadow-)DOM');
    }
  }

  override willUpdate(changedProps: Map<string | number | symbol, unknown>) {
    // Fetch content when URL changes (before render)
    if (changedProps.has('url') && this.url) {
      this.fetchContent();
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

  static override readonly styles = [previewStyles];

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

    return html`
      <div class="ma-theme" style=${getThemeStyleString(extractThemeProperties(this))}>
        <div .innerHTML=${this.htmlContent}></div>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
