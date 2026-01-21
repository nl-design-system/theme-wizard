import type { PropertyValues } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import Scraper from '../../lib/Scraper';
import { PREVIEW_THEME_CLASS } from '../../lib/Theme';
import styles from './styles';

const tag = 'wizard-preview';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ThemePreview;
  }
}

@customElement(tag)
export class ThemePreview extends LitElement {
  @property({ attribute: false }) themeCssText = '';
  @property() url?: string;

  @state() private isLoading = false;
  @state() private iframeLoaded = false;
  @state() private error = '';

  @query('iframe')
  private readonly iframeElement?: HTMLIFrameElement;

  private readonly scraper: Scraper;
  #previewCssText = '';

  static override readonly styles = [styles];

  constructor() {
    super();
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '';
    this.scraper = new Scraper(scraperURL);
  }

  override connectedCallback() {
    super.connectedCallback();
    // Only load if url is already set
    if (this.url) {
      this.#loadContent();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Reload content when url changes
    if (changedProperties.has('url') && this.url) {
      this.iframeLoaded = false;
      this.#loadContent();
    }

    if (changedProperties.has('themeCssText') || changedProperties.has('url')) {
      // If the iframe is already loaded, re-apply styles (new doc on url change; new sheet on theme change)
      this.#applyStylesToIframe();
    }
  }

  get previewUrl() {
    return `/templates${this.url || ''}`;
  }

  readonly #handleIframeLoad = () => {
    this.iframeLoaded = true;
    this.#applyStylesToIframe();
  };

  readonly #applyStylesToIframe = () => {
    const iframe = this.iframeElement;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc) return;

    // Ensure the theme scope class exists in the iframe document.
    doc.documentElement.classList.add(PREVIEW_THEME_CLASS);

    const head = doc.head ?? doc.getElementsByTagName('head')[0] ?? doc.documentElement;

    const ensureStyleTag = (id: string) => {
      const existing = doc.getElementById(id);
      if (existing instanceof HTMLStyleElement) return existing;
      const style = doc.createElement('style');
      style.id = id;
      head.appendChild(style);
      return style;
    };

    // NOTE: constructed CSSStyleSheets cannot be adopted across documents (iframe boundary),
    // so we inject CSS text instead.
    ensureStyleTag('theme-wizard-preview-css').textContent = this.#previewCssText;
    ensureStyleTag('theme-wizard-theme-css').textContent = this.themeCssText;
  };

  readonly #loadContent = async () => {
    this.isLoading = true;
    this.error = '';

    try {
      const css = await this.#fetchCSS();

      this.#previewCssText = css?.trim() ? css : '';

      // If the iframe is already loaded, make sure it sees the latest CSS.
      this.#applyStylesToIframe();
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
      return await this.scraper.getCSS(targetUrl);
    } catch (err) {
      console.error('Failed to fetch CSS:', err);
      return undefined;
    }
  };

  override render() {
    if (this.error) {
      return html`
        <div>
          <p>Error: ${this.error}</p>
        </div>
      `;
    }

    return html`
      ${this.isLoading && !this.iframeLoaded ? html`<p>Laden...</p>` : nothing}
      ${keyed(
        this.previewUrl,
        html`<iframe
          data-testid="preview"
          src=${this.previewUrl}
          @load=${this.#handleIframeLoad}
          title="Template preview"
        ></iframe>`,
      )}
    `;
  }
}
