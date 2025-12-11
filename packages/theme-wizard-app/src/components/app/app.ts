// TODO: import this when new version of MA is released
// import 'node_modules/@nl-design-system-community/ma-design-tokens/src/font.js';
// Then: remove these when importing from MA theme works
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/700.css';
// <End TODO>
import type { TemplateGroup } from '@nl-design-system-community/theme-wizard-templates';
import { provide } from '@lit/context';
import { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import {
  COLOR_KEYS,
  legacyToModernColor,
  BASIS_COLOR_NAMES,
  EXTENSION_RESOLVED_AS,
  type ColorValue,
  EXTENSION_COLOR_SCALE_POSITION,
} from '@nl-design-system-community/design-tokens-schema';
import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import buttonLinkStyles from '@utrecht/link-button-css?inline';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { WizardDownloadConfirmation } from '../wizard-download-confirmation';
import '../sidebar/sidebar';
import '../wizard-scraper';
import '../wizard-preview';
import '../wizard-logo';
import '../wizard-token-field';
import '../wizard-download-confirmation';
import '../wizard-validation-issues-alert';
import '../color-scale-picker';
import { EVENT_NAMES } from '../../constants';
import { scrapedColorsContext } from '../../contexts/scraped-colors';
import { t } from '../../i18n';
import PersistentStorage from '../../lib/PersistentStorage';
import Theme from '../../lib/Theme';
import { ColorScalePicker } from '../color-scale-picker';
import { PREVIEW_PICKER_NAME } from '../wizard-preview-picker';
import { WizardScraper } from '../wizard-scraper';
import { WizardTokenInput } from '../wizard-token-input';
import appStyles from './app.css';

const BODY_FONT_TOKEN_REF = 'basis.text.font-family.default';
const HEADING_FONT_TOKEN_REF = 'basis.heading.font-family';

/**
 * Main application component - Orchestrator coordinator
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  readonly #storage = new PersistentStorage({ prefix: 'theme-wizard' });
  readonly #theme = new Theme();
  #storageSaveTimeout: ReturnType<typeof setTimeout> | null = null;

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

  @provide({ context: scrapedColorsContext })
  @state()
  scrapedColors: ScrapedColorToken[] = [];

  @state()
  private selectedTemplatePath: string = '/my-environment/overview';

  static override readonly styles = [unsafeCSS(maTheme), unsafeCSS(buttonLinkStyles), appStyles];

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

    if (target instanceof ColorScalePicker) {
      const updates = Object.entries(target.value).map(([colorKey, value]) => {
        return {
          path: `${target.name}.${colorKey}`,
          value: value.$value,
        };
      });
      this.#theme.updateMany(updates);
    } else if (target instanceof WizardTokenInput) {
      this.#theme.updateAt(target.name, target.value);
    }

    if (target instanceof WizardTokenInput) {
      // Request update to reflect any new validation issues
      this.requestUpdate();
      // Debounce storage saves to avoid excessive writes
      this.#scheduleSave();
    }
  };

  readonly #scheduleSave = () => {
    // Clear any pending save
    if (this.#storageSaveTimeout !== null) {
      clearTimeout(this.#storageSaveTimeout);
    }

    // Schedule a new save after 500ms of inactivity
    this.#storageSaveTimeout = setTimeout(() => {
      try {
        this.#storage.setJSON(this.#theme.tokens);
        this.#storageSaveTimeout = null;
      } catch (error) {
        console.error('Failed to save tokens to storage:', error);
      }
    }, 500);
  };

  readonly #handleTemplateChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    this.selectedTemplatePath = event.detail as string;
  };

  readonly #handleReset = () => {
    this.#theme.reset();
    try {
      this.#storage.removeJSON();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
    // Cancel any pending saves since we're resetting
    if (this.#storageSaveTimeout !== null) {
      clearTimeout(this.#storageSaveTimeout);
      this.#storageSaveTimeout = null;
    }
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

  // This is a temporary handler that will be replaced with proper handling when we have new dropdowns
  readonly #handleScrapeDone = (event: Event) => {
    const target = event.target;
    if (!(target instanceof WizardScraper)) return;
    this.scrapedColors = target.colors;
  };

  override render() {
    const bodyFontToken = this.#theme.at(BODY_FONT_TOKEN_REF);
    const headingFontToken = this.#theme.at(HEADING_FONT_TOKEN_REF);

    return html`
      <div class="wizard-app ma-theme">
        <div class="wizard-app__logo">
          <wizard-logo></wizard-logo>
        </div>

        <wizard-sidebar class="wizard-app__sidebar">
          <section>
            <utrecht-heading-2>Analyseer website</utrecht-heading-2>
            <wizard-scraper @change=${this.#handleScrapeDone}></wizard-scraper>
          </section>

          <section>
            <utrecht-heading-2>Maak design keuzes</utrecht-heading-2>
            <form @change=${this.#handleTokenChange} @reset=${this.#handleReset}>
              <button class="utrecht-link-button utrecht-link-button--html-button" type="reset">Reset tokens</button>

              <wizard-token-field
                .errors=${this.#theme.issues}
                .token=${headingFontToken}
                label="${t('tokens.fieldLabels.headingFont')}"
                path=${HEADING_FONT_TOKEN_REF}
              ></wizard-token-field>
              <wizard-token-field
                .errors=${this.#theme.issues}
                .token=${bodyFontToken}
                label="${t('tokens.fieldLabels.bodyFont')}"
                path=${BODY_FONT_TOKEN_REF}
              ></wizard-token-field>

              ${BASIS_COLOR_NAMES.filter((name) => !name.endsWith('inverse')).map((colorKey) => {
                const token = this.#theme.at(`basis.color.${colorKey}.color-default`);
                let colorValue: string | undefined;

                // Get the resolved color value from extensions or fallback to token's $value
                if (token && typeof token === 'object' && '$value' in token) {
                  const tokenRecord = token as Record<string, unknown>;
                  const extensions = tokenRecord['$extensions'] as Record<string, unknown> | undefined;
                  const actualColorValue = extensions?.[EXTENSION_RESOLVED_AS] ?? tokenRecord['$value'];

                  // If the token's $value is an object (not a ref string), check if it's a valid ColorValue
                  if (
                    typeof actualColorValue === 'object' &&
                    actualColorValue !== null &&
                    'colorSpace' in actualColorValue
                  ) {
                    try {
                      colorValue = legacyToModernColor.encode(actualColorValue as ColorValue);
                    } catch {
                      // If encoding fails, leave colorValue undefined
                    }
                  }
                }

                return html`
                  <color-scale-picker
                    key=${colorKey}
                    label=${colorKey}
                    id=${`basis.color.${colorKey}`}
                    name=${`basis.color.${colorKey}`}
                    .colorValue=${colorValue}
                  ></color-scale-picker>
                `;
              })}

              <details>
                <summary>Alle tokens</summary>
                <wizard-token-field
                  .errors=${this.#theme.issues}
                  .token=${this.#theme.tokens['basis']}
                  path=${`basis`}
                  class="wizard-app__root-token-field"
                ></wizard-token-field>
              </details>
            </form>
          </section>

          <section>
            <utrecht-heading-2>Download thema</utrecht-heading-2>

            <wizard-download-confirmation
              .issues=${this.#theme.groupedIssues}
              @close=${this.#handleDialogClose}
            ></wizard-download-confirmation>

            <utrecht-button
              appearance="primary-action-button"
              type="button"
              ?disabled=${!this.#theme.modified}
              @click=${this.#handleDownloadClick}
              >Download tokens als JSON</utrecht-button
            >
          </section>
        </wizard-sidebar>

        <div class="wizard-app__nav">
          <wizard-preview-picker .templates=${this.templates}></wizard-preview-picker>
        </div>

        <section class="wizard-app__preview" aria-label="Live voorbeeld van toegepaste huisstijl">
          <wizard-preview .url=${this.selectedTemplatePath} .themeStylesheet=${this.#theme.stylesheet}></wizard-preview>
        </section>
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
