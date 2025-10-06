import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  fetchHtml,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
  rewriteInlineStyleAttributesToAbsolute,
  extractStylesheetUrls,
  fetchAndProcessExternalStylesheets,
  extractAndProcessInlineHeadStyles,
  processCustomCss,
} from '../../helpers';

@customElement('theme-preview')
export class ThemePreview extends LitElement {
  @property({ reflect: true, type: String }) url: string =
    'https://documentatie-git-feat-2654-html-stappen-f9d4f8-nl-design-system.vercel.app/examples/zonder-front-end-framework.html#';

  @property({ reflect: true, type: String }) headingFontFamily: string = 'system-ui, sans-serif';
  @property({ reflect: true, type: String }) bodyFontFamily: string = 'system-ui, sans-serif';
  @property({ reflect: true, type: String }) themeClass: string = 'voorbeeld-theme';
  @property({ reflect: true, type: String }) customCss: string = '';

  @state() private htmlContent: string = '';
  @state() private externalStyles: string = '';
  @state() private inlineStyles: string = '';
  @state() private isLoading: boolean = true;
  @state() private error: string = '';

  override connectedCallback() {
    super.connectedCallback();
    this.initializeFromURL();
  }

  override firstUpdated() {
    this.fetchContent();
  }

  override updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('url')) {
      this.fetchContent();
    }
  }

  private initializeFromURL() {
    const url = new URL(window.location.href);
    const urlParam = url.searchParams.get('url');
    const headingFontParam = url.searchParams.get('headingFont');
    const bodyFontParam = url.searchParams.get('bodyFont');
    const themeClassParam = url.searchParams.get('themeClass');
    const customCssParam = url.searchParams.get('customCss');

    if (urlParam) this.url = urlParam;
    if (headingFontParam) this.headingFontFamily = headingFontParam;
    if (bodyFontParam) this.bodyFontFamily = bodyFontParam;
    if (themeClassParam) this.themeClass = themeClassParam;
    if (customCssParam) this.customCss = customCssParam;
  }

  private async fetchContent() {
    try {
      this.isLoading = true;
      this.error = '';

      const html = await fetchHtml(this.url);
      const doc = parseHtml(html);

      rewriteAttributeUrlsToAbsolute(doc.body, this.url);
      rewriteSvgXlinkToAbsolute(doc.body, this.url);
      rewriteInlineStyleAttributesToAbsolute(doc.body, this.url);

      const stylesheetUrls = extractStylesheetUrls(doc.head, this.url);
      const externalStyles = await fetchAndProcessExternalStylesheets(stylesheetUrls);
      const inlineStyles = extractAndProcessInlineHeadStyles(doc.head, this.url);
      const processedCustomCss = processCustomCss(this.customCss, this.url);

      this.htmlContent = doc.body.innerHTML;
      this.externalStyles = externalStyles;
      this.inlineStyles = inlineStyles;
      this.customCss = processedCustomCss;
      this.isLoading = false;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load content';
      this.isLoading = false;
    }
  }

  static override styles = css`
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

    if (this.isLoading) {
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
        ${this.externalStyles
          ? html`<style>
              ${this.externalStyles}
            </style>`
          : ''}
        ${this.inlineStyles
          ? html`<style>
              ${this.inlineStyles}
            </style>`
          : ''}
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
