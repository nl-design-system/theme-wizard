import '../sidebar/sidebar';
import '../preview';
import type { TemplateGroup } from '@nl-design-system-community/theme-wizard-templates';
import { ScrapedDesignToken, EXTENSION_USAGE_COUNT } from '@nl-design-system-community/css-scraper';
import { ERROR_CODES } from '@nl-design-system-community/design-tokens-schema';
import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SidebarConfig } from '../../utils/types';
import { EVENT_NAMES } from '../../constants';
import Scraper from '../../lib/Scraper';
import Theme from '../../lib/Theme';
import ValidationIssue from '../../lib/ValidationIssue';
import '../preview-picker';
import { PREVIEW_PICKER_NAME } from '../preview-picker/index';
import { WizardTokenInput } from '../wizard-token-input';
import '../wizard-token-field';
import appStyles from './app.css';

const BODY_FONT_TOKEN_REF = 'basis.text.font-family.default';
const HEADING_FONT_TOKEN_REF = 'basis.heading.font-family';
/**
 * Main application component - Orchestrator coordinator
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  #theme = new Theme();
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
    this.addEventListener(EVENT_NAMES.TEMPLATE_CHANGE, this.#handleTemplateChange);

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
      this.#theme.updateAt(target.name, value);
      // Request update to reflect any new validation issues
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

  readonly #handleTemplateChange = (e: Event) => {
    if (!(e instanceof CustomEvent)) return;

    this.selectedTemplatePath = e.detail as string;
  };

  /**
   * Get issues grouped by ERROR_CODE
   */
  readonly #getIssuesByErrorCode = (errorCode: string): ValidationIssue[] => {
    return this.#theme.issues.filter((issue) => {
      const issueErrorCode = (issue.issue as { ERROR_CODE?: string }).ERROR_CODE;
      return issueErrorCode === errorCode;
    });
  };

  /**
   * Parse message and convert paths in curly braces to links
   * Splits message into segments and marks paths as links
   */
  readonly #formatMessageWithLinks = (message: string, issuePath: string) => {
    // Split on { and }, keeping the delimiters
    const segments = message.split(/([{}])/);
    const templates: Array<string | ReturnType<typeof html>> = [];
    let inPath = false;
    let pathContent = '';

    for (const segment of segments) {
      if (segment === '{') {
        inPath = true;
        pathContent = '';
      } else if (segment === '}' && inPath) {
        // We have a complete path, decide if it should be a link
        const fullPath = `{${pathContent}}`;
        if (pathContent === issuePath) {
          templates.push(html`<a href="#${pathContent}" data-path="${pathContent}">${fullPath}</a>`);
        } else {
          templates.push(fullPath);
        }
        inPath = false;
      } else if (inPath) {
        // Collecting path content
        pathContent += segment;
      } else if (segment) {
        // Regular text (only add if not empty)
        templates.push(segment);
      }
    }

    return html`${templates}`;
  };

  override render() {
    const bodyFontToken = this.#theme.at(BODY_FONT_TOKEN_REF);
    const headingFontToken = this.#theme.at(HEADING_FONT_TOKEN_REF);

    return html`
      <div class="theme-app ma-theme">
        <theme-wizard-sidebar .sourceUrl="" .scrapedTokens=${this.scrapedTokens} @change=${this.#handleSourceUrlChange}>
          <form @change=${this.#handleTokenChange}>
            <fieldset>
              <legend>Lettertypes</legend>
              <wizard-token-field
                .token=${headingFontToken}
                label="Koppen"
                path=${HEADING_FONT_TOKEN_REF}
              ></wizard-token-field>
              <wizard-token-field
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
          </form>
        </theme-wizard-sidebar>

        <main class="theme-preview-main" id="main-content" role="main">
          <preview-picker .templates=${this.templates}></preview-picker>
          <utrecht-alert type="error"
            ><utrecht-heading-2>Thema validatie fouten</utrecht-heading-2>
            ${Object.values(ERROR_CODES).map((errorCode) => {
              const issues = this.#getIssuesByErrorCode(errorCode);
              if (issues.length === 0) return nothing;
              return html`
                <details>
                  <summary>${errorCode}</summary>
                  <ul>
                    ${issues.map(
                      (issue) => html`<li>${this.#formatMessageWithLinks(issue.issue.message, issue.path)}</li>`,
                    )}
                  </ul>
                </details>
              `;
            })}
          </utrecht-alert>
          <section class="theme-preview" aria-label="Live voorbeeld van toegepaste huisstijl">
            <theme-wizard-preview
              .url=${this.selectedTemplatePath}
              .themeStylesheet=${this.#theme.stylesheet}
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
