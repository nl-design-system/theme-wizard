/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { DesignToken } from '@nl-design-system-community/css-scraper';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import { EVENT_NAMES } from '../../constants';
import { DEFAULT_CONFIG } from '../../constants/default';
import '../sidebar/sidebar';
import '../preview/preview';
import Scraper from '../../lib/Scraper';
import { loadUrlParams, updateURLParameters } from '../../utils';
import appStyles from './wrapper.css';

@customElement('theme-wizard-wrapper')
export class Wrapper extends LitElement {
  @property({ type: CSSStyleSheet })
  stylesheet = new CSSStyleSheet();

  @property({ type: String })
  pageTitle = 'Live Voorbeeld';

  @property({ type: String })
  pageDescription = 'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  @state()
  private config: SidebarConfig = this.getInitialConfig();

  @state()
  private scrapedTokens: DesignToken[] = [];

  private scraper: Scraper;

  static override readonly styles = [appStyles];

  constructor() {
    super();
    const scraperURL = document.querySelector('meta[name=scraper-api]')?.getAttribute('content');
    this.scraper = new Scraper(scraperURL || '');
  }

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();
    // Listen for config updates from sidebar
    this.addEventListener(EVENT_NAMES.CONFIG_CHANGE, this.handleConfigUpdate as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.CONFIG_CHANGE, this.handleConfigUpdate as EventListener);
  }

  private applyTheme({ bodyFont, headingFont }: Partial<SidebarConfig>) {
    const css = `:host {
      /* Write out common tokens based on supplied values */
      --basis-text-font-family-default: ${bodyFont || '"Comic Sans"'};
      --basis-text-font-family-monospace: 'Change me';
      --basis-text-font-weight-default: 400;
      --basis-text-font-weight-bold: 700;
      --basis-heading-font-family: ${headingFont || '"Comic Sans"'};
      --basis-heading-font-bold: 700;
    }`

    this.stylesheet.replaceSync(css);
    const preview = this.shadowRoot?.querySelector('theme-wizard-preview')
    const previewStylesheets = preview?.shadowRoot?.adoptedStyleSheets
    if (previewStylesheets) {
      previewStylesheets.push(this.stylesheet);
    }
  }

  private getInitialConfig(): SidebarConfig {
    const params = loadUrlParams(['sourceUrl', 'headingFont', 'bodyFont']);

    this.applyTheme(params);

    // Only override defaults with non-empty values from URL
    const config = { ...DEFAULT_CONFIG };
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        config[key as keyof SidebarConfig] = value;
      }
    });

    return config;
  }

  private readonly handleConfigUpdate = async (e: Event) => {
    const config = (e as CustomEvent<Partial<SidebarConfig>>).detail || {};

    if (config.sourceUrl) {
      this.scrapedTokens = await this.scraper.getTokens(new URL(config.sourceUrl));
      this.resetStylingForNewSource(config.sourceUrl!);
      this.syncConfigChanges();
      return;
    }

    this.applyTheme(config);

    this.mergeConfigUpdate(config);
    this.syncConfigChanges();
  };

  /**
   * Reset all styling when analyzing a new source URL
   */
  private resetStylingForNewSource(newSourceUrl: string) {
    this.config = {
      ...DEFAULT_CONFIG,
      sourceUrl: newSourceUrl,
    };
  }

  /**
   * Merge partial config update into existing config
   */
  private mergeConfigUpdate(partial: Partial<SidebarConfig>) {
    this.config = {
      ...this.config,
      ...partial,
    };
  }

  /**
   * Sync config changes to URL parameters
   */
  private syncConfigChanges() {
    updateURLParameters(this.config, DEFAULT_CONFIG);
  }

  override render() {
    return html`
      <div class="theme-app">
        <theme-wizard-sidebar
          .sourceUrl=${this.config.sourceUrl}
          .headingFont=${this.config.headingFont}
          .bodyFont=${this.config.bodyFont}
          .scrapedTokens=${this.scrapedTokens}
        ></theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <h2 class="theme-preview-main__title">${this.pageTitle}</h2>
          <p class="theme-preview-main__description">${this.pageDescription}</p>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview></theme-wizard-preview>
          </section>
        </main>
      </div>
    `;
  }
}
