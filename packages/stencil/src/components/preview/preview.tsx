/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, State, Watch, h } from '@stencil/core';
import {
  fetchHtml,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
  rewriteInlineStyleAttributesToAbsolute,
  // rewriteGenericUrlAttributes,
  processCustomCss,
} from '../../helpers';

@Component({
  shadow: true,
  styleUrl: 'preview.css',
  tag: 'theme-preview',
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

      // External stylesheets are no longer loaded via proxy; only inject optional custom CSS
      const processedCustomCss = processCustomCss(this.customCss, this.url);

      this.htmlContent = doc.body.innerHTML;

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

    // Process custom CSS at render-time to ensure latest value has absolute URLs
    const processedCustomCss = this.customCss ? processCustomCss(this.customCss, this.url) : '';

    if (this.isLoading) {
      return (
        <div class="theme-preview theme-preview--loading">
          <p>Laden...</p>
        </div>
      );
    }

    if (this.error) {
      return (
        <div class="theme-preview theme-preview--error">
          <p>Error: {this.error}</p>
        </div>
      );
    }

    return (
      <div class={`theme-preview ${this.themeClass}`} style={styles}>
        {/* Inject custom CSS provided by the application (textarea), processed and scoped */}
        {processedCustomCss && <style innerHTML={processedCustomCss}></style>}

        <div class="theme-preview__content" innerHTML={this.htmlContent}></div>
      </div>
    );
  }
}
