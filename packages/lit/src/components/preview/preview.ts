import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fetchHtml, parseHtml, rewriteAttributeUrlsToAbsolute, rewriteSvgXlinkToAbsolute } from '../../helpers';

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

  override firstUpdated() {
    this.fetchContent();
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

    if (detail.sourceUrl) {
      const normalized = this.normalizeUrl(detail.sourceUrl);
      if (normalized !== this.url) {
        this.url = normalized;
      } else {
        // Same URL value; still re-run analysis
        this.fetchContent();
      }
    }
    if (detail.headingFont) this.headingFontFamily = detail.headingFont;
    if (detail.bodyFont) this.bodyFontFamily = detail.bodyFont;
    if (detail.themeClass) this.themeClass = detail.themeClass;
    if (typeof detail.customCss === 'string') this.customCss = detail.customCss;
  };

  private readonly initializeFromURL = () => {
    const url = new URL(window.location.href);
    const urlParam = url.searchParams.get('url');
    const headingFontParam = url.searchParams.get('headingFont');
    const bodyFontParam = url.searchParams.get('bodyFont');
    const themeClassParam = url.searchParams.get('themeClass');
    const customCssParam = url.searchParams.get('customCss');

    if (urlParam) this.url = this.normalizeUrl(urlParam);
    if (headingFontParam) this.headingFontFamily = headingFontParam;
    if (bodyFontParam) this.bodyFontFamily = bodyFontParam;
    if (themeClassParam) this.themeClass = themeClassParam;
    if (customCssParam) this.customCss = customCssParam;
  };

  private readonly normalizeUrl = (value: string): string => {
    if (!value) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://${value}`;
  };

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

  static override readonly styles = css`
    .theme-preview--loading,
    .theme-preview--error {
      padding: 1rem;
      font-family: sans-serif;
    }

    .theme-preview__content {
      all: initial;
    }
  `;

  override render() {
    const styleVars = {
      '--theme-body-font-family': this.bodyFontFamily,
      '--theme-heading-font-family': this.headingFontFamily,
    };

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
      <div class="theme-preview ${this.themeClass}" style=${this.mapToStyle(styleVars)}>
        ${this.customCss
          ? html`<style>
              ${this.customCss}
            </style>`
          : ''}
        <div class="theme-preview__content" .innerHTML=${this.htmlContent}></div>
      </div>
    `;
  }

  private readonly mapToStyle = (vars: Record<string, string>): string => {
    return Object.entries(vars)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  };
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-preview': ThemePreview;
  }
}
