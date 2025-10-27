import '../preview/preview';
import '../sidebar/sidebar';
import { ScrapedDesignToken, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import { EVENT_NAMES } from '../../constants';
import { ThemeController } from '../../controllers';
import Scraper from '../../lib/Scraper';
import appStyles from './app.css';

/**
 * Main application component - Orchestrator coordinator
 *
 * This component:
 * - Initializes ThemeController (orchestrator)
 * - Binds controller/model data to child components via props
 * - Handles layout and rendering
 * - Bridges events from components to controller
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  private readonly themeController: ThemeController = new ThemeController();
  private readonly scraper: Scraper = new Scraper(
    document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '',
  );

  @state()
  private scrapedTokens: ScrapedDesignToken[] = [];

  @state()
  private selectedTemplate: 'collage' | 'preview' = 'collage';

  static override readonly styles = [appStyles];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();
    this.addEventListener(EVENT_NAMES.CONFIG_CHANGE, this.#handleConfigUpdate);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.CONFIG_CHANGE, this.#handleConfigUpdate);
  }

  /**
   * Handle configuration updates from child components
   * Bridge events to controller
   */
  readonly #handleConfigUpdate = async (e: Event) => {
    if (!(e instanceof CustomEvent)) return;

    const config: Partial<SidebarConfig> = e.detail || {};

    if (config.sourceUrl) {
      await this.#handleSourceUrlChange(config.sourceUrl);
    } else {
      this.themeController.applyPartial(config);
    }
  };

  /**
   * Handle source URL changes - scrape tokens
   */
  readonly #handleSourceUrlChange = async (sourceUrl: string): Promise<void> => {
    try {
      this.themeController.resetToDefaults();
      const tokens = await this.scraper.getTokens(new URL(sourceUrl));
      this.scrapedTokens = tokens.sort(
        (a, b) =>
          // Reverse order, highest count first
          b.$extensions[EXTENSION_USAGE_COUNT] - a.$extensions[EXTENSION_USAGE_COUNT],
      );

      this.requestUpdate();
    } catch (error) {
      console.error('Failed to analyze website:', error);
    }
  };

  readonly #handleTemplateChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.selectedTemplate = select.value as 'collage' | 'preview';
  };

  override render() {
    const { bodyFont, headingFont, previewUrl, sourceUrl } = this.themeController.getConfig();

    // Determine template config based on selection
    const templateConfig =
      this.selectedTemplate === 'collage'
        ? {
            cssUrl: '/templates/collage/variation.css',
            htmlUrl: '/templates/collage/variation.html',
          }
        : undefined;

    return html`
      <div class="theme-app">
        <theme-wizard-sidebar
          .sourceUrl=${sourceUrl}
          .headingFont=${headingFont}
          .bodyFont=${bodyFont}
          .scrapedTokens=${this.scrapedTokens}
          .onResetTheme=${() => this.themeController.resetToDefaults()}
        ></theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <!-- Placeholder for component selector -->
          <div>
            <label for="template-select"> Kies een template: </label>
            <select id="template-select" @change=${this.#handleTemplateChange}>
              <option value="collage" ?selected=${this.selectedTemplate === 'collage'}>
                Collage (Component Variaties)
              </option>
              <option value="preview" ?selected=${this.selectedTemplate === 'preview'}>Preview</option>
            </select>
          </div>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              .templateConfig=${templateConfig}
              .url=${this.selectedTemplate === 'preview' ? previewUrl : undefined}
              .themeStylesheet=${this.themeController.stylesheet}
            ></theme-wizard-preview>
          </section>
        </main>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-app': App;
  }
}
