/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, State, Watch, h } from '@stencil/core';
import { DEFAULT_CONFIG } from '../../constants';
import {
  extractThemeProperties,
  fetchHtml,
  getThemeStyleProperties,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
} from '../../utils';

@Component({
  shadow: true,
  styleUrl: 'preview.css',
  tag: 'theme-wizard-preview',
})
export class ThemePreview {
  @Prop() url: string = DEFAULT_CONFIG.sourceUrl;
  @Prop() headingFontFamily: string = DEFAULT_CONFIG.headingFont;
  @Prop() bodyFontFamily: string = DEFAULT_CONFIG.bodyFont;
  @Prop() themeClass: string = DEFAULT_CONFIG.themeClass;
  @Prop() customCss: string = DEFAULT_CONFIG.customCss;

  @State() htmlContent = '';
  @State() isLoading = false;
  @State() error = '';

  @Watch('url')
  async handleUrlChange() {
    if (this.url) {
      await this.fetchContent();
    }
  }

  componentWillLoad() {
    // Initial fetch on component load
    if (this.url) {
      this.fetchContent();
    }
  }

  /**
   * Fetch the content from the URL
   */
  async fetchContent() {
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
  }

  render() {
    if (this.isLoading && !this.htmlContent) {
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
      <div class={`theme-preview ${this.themeClass}`} style={getThemeStyleProperties(extractThemeProperties(this))}>
        {this.customCss && <style innerHTML={this.customCss}></style>}
        <div class="theme-preview__content" innerHTML={this.htmlContent}></div>
      </div>
    );
  }
}
