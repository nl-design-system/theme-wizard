import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_CONFIG } from '../../constants/default';
import {
  EVENT_NAMES,
  extractThemeProperties,
  fetchHtml,
  getThemeStyleString,
  parseHtml,
  rewriteAttributeUrlsToAbsolute,
  rewriteSvgXlinkToAbsolute,
  loadUrlParams,
  UrlParamsConfig,
} from '../../utils';
import previewStyles from './preview.css';

@customElement('theme-wizard-preview')
export class ThemePreview extends LitElement {
  @property() url: string = DEFAULT_CONFIG.sourceUrl;

  @property() headingFontFamily: string = DEFAULT_CONFIG.headingFont;
  @property() bodyFontFamily: string = DEFAULT_CONFIG.bodyFont;
  @property() themeClass: string = DEFAULT_CONFIG.themeClass;
  @property() customCss: string = DEFAULT_CONFIG.customCss;

  @state() private htmlContent = '';
  @state() private isLoading = false;
  @state() private error = '';

  override connectedCallback() {
    super.connectedCallback();
    this.initializeFromURL();
    document.addEventListener(EVENT_NAMES.SIDEBAR_CONFIG_CHANGED, this.handleConfigChanged as EventListener);
  }

  override updated(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has('url')) {
      this.fetchContent();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(EVENT_NAMES.SIDEBAR_CONFIG_CHANGED, this.handleConfigChanged as EventListener);
  }

  private readonly handleConfigChanged = (e: Event) => {
    this.updatePropertiesFromConfig((e as CustomEvent).detail || {});
    this.fetchContent();
  };

  /**
   * Initialize the component properties from the URL parameters
   * and fetch the content if the sourceUrl is present
   */
  private readonly initializeFromURL = () => {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont', 'themeClass', 'customCss']);
    const hasSourceUrlToFetch = params.sourceUrl;
    this.updatePropertiesFromConfig(params);

    if (hasSourceUrlToFetch) {
      this.fetchContent();
    }
  };

  /**
   * Update the component properties from the config
   * @param config - The config object { bodyFont, customCss, headingFont, sourceUrl, themeClass }
   * TODO: use property mapping for the growing number of properties
   */
  private updatePropertiesFromConfig(config: UrlParamsConfig): void {
    const { bodyFont, customCss, headingFont, sourceUrl, themeClass } = config;

    if (sourceUrl) this.url = sourceUrl;
    if (headingFont) this.headingFontFamily = headingFont;
    if (bodyFont) this.bodyFontFamily = bodyFont;
    if (themeClass) this.themeClass = themeClass;
    if (customCss) this.customCss = customCss;
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
