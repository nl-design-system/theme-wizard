import type { TemplateGroup } from '@nl-design-system-community/theme-wizard-templates';
import { ScrapedDesignToken, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import type { WizardDownloadConfirmation } from '../wizard-download-confirmation';
import { EVENT_NAMES } from '../../constants';
import PersistentStorage from '../../lib/PersistentStorage';
import Scraper from '../../lib/Scraper';
import Theme from '../../lib/Theme';
import { PREVIEW_PICKER_NAME } from '../wizard-preview-picker';
import '../sidebar/sidebar';
import '../wizard-preview';
import '../wizard-token-field';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import { WizardTokenInput } from '../wizard-token-input';
import appStyles from './app.css';

const BODY_FONT_TOKEN_REF = 'basis.text.font-family.default';
const HEADING_FONT_TOKEN_REF = 'basis.heading.font-family';
/**
 * Main application component - Orchestrator coordinator
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  #storage = new PersistentStorage({ prefix: 'theme-wizard' });
  #theme = new Theme();
  private readonly scraper: Scraper = new Scraper(
    document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '',
  );

  @query('wizard-download-confirmation')
  private readonly dialogElement?: WizardDownloadConfirmation;

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
    this.addEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);

    const previousTokens = this.#storage.getJSON();
    if (previousTokens) {
      this.#theme.tokens = previousTokens;
    }

    // Parse template selection from query param: ?templates=/group/page (dynamic)
    try {
      const templatePath = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME);
      if (templatePath) this.selectedTemplatePath = templatePath;
    } catch {
      // ignore parsing errors
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);
  }

  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting
    if (target instanceof WizardTokenInput) {
      const value = target.value;
      this.#theme.updateToken(target.name, value);
      // Request update to reflect any new validation issues
      this.requestUpdate();
      this.#storage.setJSON(this.#theme.tokens);
      this.requestUpdate();
    }
  };

  /**
   * Handle source URL changes - scrape tokens
   */
  readonly #handleSourceUrlChange = async (e: Event) => {
    if (!(e instanceof CustomEvent)) return;

    const { sourceUrl }: Partial<SidebarConfig> = e.detail || {};

    if (sourceUrl) {
      try {
        const tokens = await this.scraper.getTokens(new URL(sourceUrl));
        const sortedTokens = [...tokens].sort(
          (a, b) => b.$extensions[EXTENSION_USAGE_COUNT] - a.$extensions[EXTENSION_USAGE_COUNT],
        );
        this.scrapedTokens = sortedTokens;

        this.requestUpdate();
      } catch (error) {
        console.error('Failed to analyze website:', error);
      }
    }
  };

  readonly #handleTemplateChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;

    this.selectedTemplatePath = event.detail as string;
  };

  readonly #handleReset = () => {
    this.#theme.reset();
    this.#storage.removeJSON();
    this.requestUpdate();
  };

  readonly #downloadJSON = async () => {
    const data = await this.#theme.toTokensJSON();
    const encoded = encodeURIComponent(data);
    const href = `data:application/json,${encoded}`;
    const anchor = document.createElement('a');
    anchor.download = 'tokens.json';
    anchor.href = href;
    anchor.click();
    anchor.remove();
  };

  readonly #handleDownloadClick = () => {
    if (this.#theme.errorCount > 0) {
      this.dialogElement?.open();
      return;
    }

    this.#downloadJSON();
  };

  readonly #handleDialogClose = (event: Event) => {
    const dialog = event.currentTarget as WizardDownloadConfirmation;
    if (dialog.returnValue === 'confirm') {
      this.#downloadJSON();
    }
  };

  override render() {
    const bodyFontToken = this.#theme.getToken(BODY_FONT_TOKEN_REF);
    const headingFontToken = this.#theme.getToken(HEADING_FONT_TOKEN_REF);
    const colorTokens = this.#theme.getToken(COLOR_TOKENS_REF);

    return html`
      <div class="theme-app ma-theme">
        <wizard-download-confirmation
          .issues=${this.#theme.groupedIssues}
          @close=${this.#handleDialogClose}
        ></wizard-download-confirmation>
        <theme-wizard-sidebar
          .sourceUrl=""
          .scrapedTokens=${this.scrapedTokens}
          @config-change=${this.#handleSourceUrlChange}
        >
          <form @change=${this.#handleTokenChange} @reset=${this.#handleReset}>
            <fieldset>
              <legend>Lettertypes</legend>
              <wizard-token-field
                .errors=${this.#theme.issues}
                .token=${headingFontToken}
                label="Koppen"
                path=${HEADING_FONT_TOKEN_REF}
              ></wizard-token-field>
              <wizard-token-field
                .errors=${this.#theme.issues}
                .token=${bodyFontToken}
                label="Lopende tekst"
                path=${BODY_FONT_TOKEN_REF}
              ></wizard-token-field>
            </fieldset>

            <details>
              <summary>Alle tokens</summary>
              <wizard-token-field
                .errors=${this.#theme.issues}
                .token=${this.#theme.tokens['basis']}
                path=${`basis`}
              ></wizard-token-field>
            </details>

            <utrecht-button
              appearance="primary-action-button"
              type="button"
              ?disabled=${!this.#theme.modified}
              @click=${this.#handleDownloadClick}
              >Download tokens als JSON</utrecht-button
            >
            <utrecht-button appearance="secondary-action-button" type="reset">Reset tokens</utrecht-button>
          </form>
        </theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <wizard-preview-picker .templates=${this.templates}></wizard-preview-picker>
          ${this.#theme.errorCount > 0
            ? html`<wizard-validation-issues-alert
                .errors=${this.#theme.groupedIssues}
              ></wizard-validation-issues-alert>`
            : nothing}
          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <wizard-preview
              .url=${this.selectedTemplatePath}
              .themeStylesheet=${this.#theme.stylesheet}
            ></wizard-preview>
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
