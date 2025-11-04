import '../preview/preview';
import type { TemplateGroup } from '@nl-design-system-community/templates';
import { ScrapedDesignToken, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import { EVENT_NAMES } from '../../constants';
import { ThemeController } from '../../controllers';
import Scraper from '../../lib/Scraper';
import { PREVIEW_PICKER_NAME } from '../preview-picker';
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

  // Template list provided by the host application (JSON string attribute)
  @property({ attribute: 'templates' }) templatesAttr?: string;

  // Parsed templates list (computed)
  get templates(): TemplateGroup[] {
    try {
      if (this.templatesAttr) {
        const parsed = JSON.parse(this.templatesAttr);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      console.error('Failed to parse templates:', this.templatesAttr);
    }
    return [];
  }

  @state()
  private scrapedTokens: ScrapedDesignToken[] = [];

  @state()
  private selectedTemplatePath: string = '/my-environment/overview';

  static override readonly styles = [unsafeCSS(maTheme), appStyles];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();
    this.addEventListener(EVENT_NAMES.CONFIG_CHANGE, this.#handleConfigUpdate);
    this.addEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);

    // Parse template selection from query param: ?templates=/group/page (dynamic)
    try {
      const params = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME);
      if (params) {
        const [group, page] = params.split('/').filter(Boolean);
        if (group && page) this.selectedTemplatePath = `/${group}/${page}`;
      }
    } catch {
      // ignore parsing errors
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.CONFIG_CHANGE, this.#handleConfigUpdate);
    this.removeEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);
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
      const sortedTokens = [...tokens].sort(
        (a, b) => b.$extensions[EXTENSION_USAGE_COUNT] - a.$extensions[EXTENSION_USAGE_COUNT],
      );
      this.scrapedTokens = sortedTokens;

      this.requestUpdate();
    } catch (error) {
      console.error('Failed to analyze website:', error);
    }
  };

  readonly #handleTemplateChange = (e: Event) => {
    if (!(e instanceof CustomEvent)) return;

    this.selectedTemplatePath = e.detail as string;
  };

  override render() {
    const { bodyFont, headingFont, sourceUrl } = this.themeController.getConfig();

    return html`
      <div class="theme-app ma-theme">
        <theme-wizard-sidebar
          .sourceUrl=${sourceUrl}
          .headingFont=${headingFont}
          .bodyFont=${bodyFont}
          .scrapedTokens=${this.scrapedTokens}
          .onResetTheme=${() => this.themeController.resetToDefaults()}
        ></theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <preview-picker .templates=${this.templates}></preview-picker>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              .url=${this.selectedTemplatePath}
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
