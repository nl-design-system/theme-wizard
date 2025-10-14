import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import { EVENT_NAMES } from '../../constants';
import { ThemeController } from '../../controllers';
import '../sidebar/sidebar';
import '../preview/preview';
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
  private readonly themeController: ThemeController = new ThemeController(this);

  @property({ type: String })
  pageTitle = 'Live Voorbeeld';

  @property({ type: String })
  pageDescription = 'Hieronder zie je een live voorbeeld van de opgegeven website met de geselecteerde huisstijl.';

  static override readonly styles = [appStyles];

  override connectedCallback() {
    super.connectedCallback();
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

    const config = e.detail || {};
    if (config.sourceUrl) {
      await this.themeController.analyzeSourceUrl(config.sourceUrl);
    } else {
      this.themeController.updateTheme(config);
    }
  };

  override render() {
    const { bodyFont, headingFont, previewUrl, sourceUrl } = this.themeController.getConfig();

    return html`
      <div class="theme-app">
        <theme-wizard-sidebar
          .sourceUrl=${sourceUrl}
          .headingFont=${headingFont}
          .bodyFont=${bodyFont}
          .scrapedTokens=${this.themeController.getScrapedTokens()}
          .onResetTheme=${() => this.themeController.resetToDefaults()}
        ></theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <h2 class="theme-preview-main__title">${this.pageTitle}</h2>
          <p class="theme-preview-main__description">${this.pageDescription}</p>

          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              .url=${previewUrl}
              .stylesheet=${this.themeController.getStylesheet()}
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
