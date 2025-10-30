import '../preview/preview';
import '../sidebar/sidebar';
import { ScrapedDesignToken, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  // Template list provided by the host application (JSON string attribute)
  // Expected shape: [{ htmlUrl, name, title, pageTitle, page }]
  @property({ attribute: 'templates' }) templatesAttr?: string;

  // Parsed templates list (computed)
  get templates(): Array<{
    id: string;
    htmlUrl: string;
    name: string;
    title: string;
    pageTitle: string;
    page: string;
  }> {
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
  private selectedTemplateName: string = 'mijn-omgeving';

  static override readonly styles = [appStyles];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();
    this.addEventListener(EVENT_NAMES.CONFIG_CHANGE, this.#handleConfigUpdate);

    const params = new URL(globalThis.location.href).searchParams.get('templates'); // "/my-environment/overview"
    if (params) {
      const [, template] = params.split('/');
      if (template) this.selectedTemplateName = template;
    }
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

  override render() {
    const { bodyFont, headingFont, previewUrl, sourceUrl } = this.themeController.getConfig();

    // Determine template config based on selection
    const selected =
      this.templates.find((template) => template.name === this.selectedTemplateName) || this.templates[0];
    const templateUrl = selected?.htmlUrl;

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
            <form method="GET">
              <label for="template-select"> Kies een template: </label>
              <select id="template-select" name="templates">
                ${(() => {
                  let current = '';
                  try {
                    current = new URL(globalThis.location.href).searchParams.get('templates') || '';
                  } catch {
                    // ignore
                  }
                  return this.templates.map((template) => {
                    const value = `/${template.name}/${template.page}`;
                    const selected = current === value;

                    return html`<optgroup label=${template.title}>
                      <option value=${value} ?selected=${selected}>${template.pageTitle}</option>
                    </optgroup>`;
                  });
                })()}
              </select>
              <button type="submit">Toepassen</button>
            </form>
          </div>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              .templateUrl=${templateUrl}
              .url=${selected?.name === 'mijn-omgeving' ? previewUrl : undefined}
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
