import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  extractThemeProperties,
  fetchHtml,
  getThemeStyleString,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
} from '../../helpers';
import previewStyles from './preview.css';

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property({ reflect: true, type: String }) url: string =
    'https://documentatie-git-feat-2654-html-stappen-f9d4f8-nl-design-system.vercel.app/examples/zonder-front-end-framework.html#';

  @property({ reflect: true, type: String }) headingFontFamily: string = 'system-ui, sans-serif';
  @property({ reflect: true, type: String }) bodyFontFamily: string = 'system-ui, sans-serif';
  @property({ reflect: true, type: String }) themeClass: string = 'voorbeeld-theme';
  @property({ reflect: true, type: String }) customCss: string = '';

  @state() private htmlContent: string = '';
  @state() private isLoading: boolean = true;
  @state() private error: string = '';

  override connectedCallback() {
    super.connectedCallback();
    this.initializeFromURL();
    document.addEventListener('configChanged', this.handleConfigChanged as EventListener);
  }

  override updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('url')) {
      this.fetchContent();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('configChanged', this.handleConfigChanged as EventListener);
  }

  private readonly handleConfigChanged = (e: CustomEvent) => {
    const detail = (e?.detail || {}) as {
      sourceUrl?: string;
      headingFont?: string;
      bodyFont?: string;
      themeClass?: string;
      customCss?: string;
    };
    const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = detail;

    if (sourceUrl) this.url = sourceUrl;
    if (headingFont) this.headingFontFamily = headingFont;
    if (bodyFont) this.bodyFontFamily = bodyFont;
    if (themeClass) this.themeClass = themeClass;
    if (customCss) this.customCss = customCss;

    this.fetchContent();
  };

  private readonly initializeFromURL = () => {
    const url = new URL(window.location.href);
    const sourceUrlParam = url.searchParams.get('sourceUrl');
    const headingFontParam = url.searchParams.get('headingFont');
    const bodyFontParam = url.searchParams.get('bodyFont');
    const themeClassParam = url.searchParams.get('themeClass');
    const customCssParam = url.searchParams.get('customCss');

    const initialUrl = sourceUrlParam || '';
    if (initialUrl) this.url = initialUrl;
    if (headingFontParam) this.headingFontFamily = headingFontParam;
    if (bodyFontParam) this.bodyFontFamily = bodyFontParam;
    if (themeClassParam) this.themeClass = themeClassParam;
    if (customCssParam) this.customCss = customCssParam;

    // Trigger initial fetch when a URL param is present
    if (initialUrl) this.fetchContent();
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
      this.requestUpdate();
    }
  };

  static override readonly styles = [previewStyles];

  override render() {
    if (this.isLoading && !this.htmlContent) {
      return html`
        <div class="theme-preview theme-preview--loading">
          <p>Laden...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="theme-preview theme-preview--error">
          <p>Error: ${this.error}</p>
        </div>
      `;
    }

    return html`
      <div class="theme-preview ${this.themeClass}" style=${getThemeStyleString(extractThemeProperties(this))}>
        ${this.customCss
          ? html`<style>
              ${this.customCss}
            </style>`
          : ''}
        <div class="theme-preview__content" .innerHTML=${this.htmlContent}></div>
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
