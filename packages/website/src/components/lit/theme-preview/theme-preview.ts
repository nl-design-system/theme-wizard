/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import previewStyles from './theme-preview.css.ts';
import {
  fetchHtml,
  parseHtml,
  extractStylesheetUrls,
  fetchAndProcessExternalStylesheets,
  extractAndProcessInlineHeadStyles,
  processCustomCss,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
  rewriteInlineStyleAttributesToAbsolute,
  loadUrlParams,
  getThemeStyleString,
  extractThemeProperties,
} from '../../../helpers/index.ts';

@customElement('lit-theme-preview')
export class LitThemePreview extends LitElement {
  @property({ type: String })
  url =
    'https://documentatie-git-feat-2654-html-stappen-f9d4f8-nl-design-system.vercel.app/examples/zonder-front-end-framework.html#';

  @property({ type: String, reflect: true })
  headingFontFamily = 'system-ui, sans-serif';

  @property({ type: String, reflect: true })
  bodyFontFamily = 'system-ui, sans-serif';

  @property({ type: String, reflect: true })
  themeClass = 'voorbeeld-theme';

  @property({ type: String })
  customCss = '';

  @state()
  htmlContent = '';

  @state()
  externalStyles = '';

  @state()
  inlineStyles = '';

  @state()
  isLoading = true;

  @state()
  error = '';

  static readonly styles = previewStyles;

  connectedCallback() {
    super.connectedCallback();
    this.loadFromUrlParams();
    this.fetchContent();

    // Listen for config changes from sidebar (on document level)
    document.addEventListener('configChanged', this.handleConfigChange);
    // Listen for typography changes from typography component
    document.addEventListener('typographyChanged', this.handleTypographyChange);
  }

  private loadFromUrlParams() {
    const params = loadUrlParams(['url', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);

    // Apply loaded parameters to component properties
    if (params.url) this.url = params.url;
    if (params.headingFont) this.headingFontFamily = params.headingFont;
    if (params.bodyFont) this.bodyFontFamily = params.bodyFont;
    if (params.themeClass) this.themeClass = params.themeClass;
    if (params.customCss) this.customCss = params.customCss;

    console.log('Preview loaded from URL params:', params);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('configChanged', this.handleConfigChange);
    document.removeEventListener('typographyChanged', this.handleTypographyChange);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    console.log('Preview updated with changed properties:', Array.from(changedProperties.keys()));

    if (changedProperties.has('url')) {
      console.log('URL changed, fetching new content');
      this.fetchContent();
    }
    if (
      changedProperties.has('headingFontFamily') ||
      changedProperties.has('bodyFontFamily') ||
      changedProperties.has('themeClass') ||
      changedProperties.has('customCss')
    ) {
      console.log('Typography/theme properties changed, updating preview');
      this.updatePreview();
    }
  }

  private readonly handleConfigChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    const config = customEvent.detail;

    console.log('Preview received config change:', config);
    console.log('Current URL:', this.url);
    console.log('New URL from config:', config.sourceUrl);

    // Update URL if changed
    if (config.sourceUrl && config.sourceUrl !== this.url) {
      console.log('Updating URL from', this.url, 'to', config.sourceUrl);
      this.url = config.sourceUrl;
    } else {
      console.log('URL not changed - same or empty');
    }

    // Update other properties
    if (config.headingFont) {
      this.headingFontFamily = config.headingFont;
    }
    if (config.bodyFont) {
      this.bodyFontFamily = config.bodyFont;
    }
    if (config.themeClass) {
      this.themeClass = config.themeClass;
    }
    if (config.customCss !== undefined) {
      this.customCss = config.customCss;
    }
  };

  private readonly handleTypographyChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    const config = customEvent.detail;

    console.log('Preview received typography change:', config);

    // Update typography properties
    if (config.headingFont) {
      console.log('Updating heading font to:', config.headingFont);
      this.headingFontFamily = config.headingFont;
    }
    if (config.bodyFont) {
      console.log('Updating body font to:', config.bodyFont);
      this.bodyFontFamily = config.bodyFont;
    }
  };

  private async fetchContent() {
    if (!this.url) return;

    this.isLoading = true;
    this.error = '';

    try {
      // Use helper to fetch HTML
      const html = await fetchHtml(this.url);
      this.htmlContent = html;

      // Process the content using helper utilities
      await this.processContent();
      this.updatePreview();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      this.isLoading = false;
    }
  }

  private async processContent() {
    if (!this.htmlContent) return;

    // Parse HTML using helper
    const doc = parseHtml(this.htmlContent);
    const baseUrl = this.url;

    // Extract and process external stylesheets
    const stylesheetUrls = extractStylesheetUrls(doc.head, baseUrl);
    const processedExternalStyles = await fetchAndProcessExternalStylesheets(stylesheetUrls);

    // Extract and process inline head styles
    const processedInlineStyles = extractAndProcessInlineHeadStyles(doc.head, baseUrl);

    // Process custom CSS
    const processedCustomCss = processCustomCss(this.customCss, baseUrl);

    // Update styles
    this.externalStyles = processedExternalStyles;
    this.inlineStyles = processedInlineStyles;
    this.customCss = processedCustomCss;

    // Process HTML content for absolute URLs
    const bodyElement = doc.body;
    if (bodyElement) {
      rewriteAttributeUrlsToAbsolute(bodyElement, baseUrl);
      rewriteSvgXlinkToAbsolute(bodyElement, baseUrl);
      rewriteInlineStyleAttributesToAbsolute(bodyElement, baseUrl);
    }

    // Update HTML content with processed URLs
    this.htmlContent = doc.documentElement.outerHTML;
  }

  private updatePreview() {
    console.log('updatePreview called with:', {
      headingFontFamily: this.headingFontFamily,
      bodyFontFamily: this.bodyFontFamily,
      themeClass: this.themeClass,
      customCss: this.customCss ? 'present' : 'empty',
    });

    // This method is called when typography or theme settings change
    // Re-process custom CSS if it changed
    if (this.htmlContent) {
      const processedCustomCss = processCustomCss(this.customCss, this.url);
      this.customCss = processedCustomCss;
    }
    // The content will be re-rendered automatically through the render() method
  }

  render() {
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
      <div class="theme-preview ${this.themeClass}" style=${getThemeStyleString(extractThemeProperties(this))}>
        <!-- Inject fetched external CDN stylesheets -->
        ${this.externalStyles
          ? html`<style>
              ${this.externalStyles}
            </style>`
          : ''}

        <!-- Inject inline styles from the original page's head -->
        ${this.inlineStyles
          ? html`<style>
              ${this.inlineStyles}
            </style>`
          : ''}

        <!-- Inject custom CSS provided by the application -->
        ${this.customCss
          ? html`<style>
              ${this.customCss}
            </style>`
          : ''}

        <!-- Main content -->
        <div class="theme-preview__content" .innerHTML=${this.htmlContent}></div>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-preview': LitThemePreview;
  }
}
