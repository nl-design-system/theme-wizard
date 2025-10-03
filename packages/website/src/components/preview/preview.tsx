/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import { Component, h, Prop, State, Watch } from '@stencil/core';
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

@Component({
  shadow: true,
  styleUrl: 'preview.css',
  tag: 'example-theme-preview',
})
export class ThemePreview {
  @Prop({ mutable: true }) url: string =
    'https://documentatie-git-feat-2654-html-stappen-f9d4f8-nl-design-system.vercel.app/examples/zonder-front-end-framework.html#';

  @Watch('url')
  async handleUrlChange() {
    await this.fetchContent();
  }

  // Typography
  @Prop({ reflect: true }) headingFontFamily: string = 'system-ui, sans-serif';
  @Prop({ reflect: true }) bodyFontFamily: string = 'system-ui, sans-serif';

  // Theme class
  @Prop({ reflect: true }) themeClass: string = 'voorbeeld-theme';

  // Custom CSS injected from the host app (scoped inside Shadow DOM)
  @Prop() customCss: string = '';

  @State() htmlContent: string = '';
  @State() externalStyles: string = '';
  @State() inlineStyles: string = '';
  @State() isLoading: boolean = true;
  @State() error: string = '';

  async componentWillLoad() {
    // Initialize from URL parameters
    this.initializeFromURL();
    await this.fetchContent();
  }

  private initializeFromURL() {
    const url = new URL(window.location.href);

    // Read URL parameters
    const urlParam = url.searchParams.get('url');
    const headingFontParam = url.searchParams.get('headingFont');
    const bodyFontParam = url.searchParams.get('bodyFont');
    const themeClassParam = url.searchParams.get('themeClass');
    const customCssParam = url.searchParams.get('customCss');

    // Set props from URL parameters
    if (urlParam) this.url = urlParam;
    if (headingFontParam) this.headingFontFamily = headingFontParam;
    if (bodyFontParam) this.bodyFontFamily = bodyFontParam;
    if (themeClassParam) this.themeClass = themeClassParam;
    if (customCssParam) this.customCss = customCssParam;
  }

  async fetchContent() {
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

  render() {
    const styles = {
      '--theme-body-font-family': this.bodyFontFamily,
      '--theme-heading-font-family': this.headingFontFamily,
    };

    // Rewrite customCss to be Shadow DOM scoped and asset URLs absolute relative to this.url
    const processedCustomCss = this.customCss ? processCustomCss(this.customCss, this.url) : '';

    if (this.isLoading) {
      return (
        <div class="example-theme-preview example-theme-preview--loading">
          <p>Laden...</p>
        </div>
      );
    }

    if (this.error) {
      return (
        <div class="example-theme-preview example-theme-preview--error">
          <p>Error: {this.error}</p>
        </div>
      );
    }

    return (
      <div class={`example-theme-preview ${this.themeClass}`} style={styles}>
        {/* Inject fetched external CDN stylesheets (with :root replaced by :host) */}
        {this.externalStyles && <style innerHTML={this.externalStyles}></style>}

        {/* Inject inline <style> tags from the original page's <head> */}
        {this.inlineStyles && <style innerHTML={this.inlineStyles}></style>}

        {/* Inject custom CSS provided by the application (textarea), processed and scoped */}
        {processedCustomCss && <style innerHTML={processedCustomCss}></style>}

        <div class="example-theme-preview__content" innerHTML={this.htmlContent}></div>
      </div>
    );
  }
}
