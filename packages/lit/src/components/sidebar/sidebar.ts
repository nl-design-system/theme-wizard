import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_TOKEN_ID,
  type ScrapedDesignToken,
  type ScrapedColorToken,
} from '@nl-design-system-community/css-scraper';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_TYPOGRAPHY, EVENT_NAMES } from '../../constants';
import { DEFAULT_CONFIG } from '../../constants/default';
import ColorScale from '../../lib/ColorScale';
import ColorToken from '../../lib/ColorToken';
import { isValidUrl } from '../../utils';
import sidebarStyles from './sidebar.css';
import '../color-select';
import '../color-scale';
import '../font-select';

@customElement('theme-wizard-sidebar')
export class LitSidebar extends LitElement {
  @property() sourceUrl = DEFAULT_CONFIG.sourceUrl;
  @property() headingFont = DEFAULT_CONFIG.headingFont;
  @property() bodyFont = DEFAULT_CONFIG.bodyFont;
  @property({ attribute: false }) onResetTheme?: () => void;

  @state() brandColors: ColorToken[] = [];

  @property() scrapedTokens: ScrapedDesignToken[] = [];

  static override readonly styles = [sidebarStyles];

  private notifyConfigChange(config: Partial<typeof DEFAULT_CONFIG>) {
    const event = new CustomEvent(EVENT_NAMES.CONFIG_CHANGE, {
      bubbles: true,
      composed: true,
      detail: config,
    });
    this.dispatchEvent(event);
  }

  private readonly handleScrapeForm = (event: Event): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;

    if (sourceUrl?.trim() && !isValidUrl(sourceUrl)) {
      return;
    }

    this.notifyConfigChange({
      ...DEFAULT_CONFIG,
      sourceUrl,
    });
  };

  private readonly handleThemeForm = (event: Event): void => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const headingFont = formData.get('heading-font');
    const bodyFont = formData.get('body-font');
    const brandColors = formData.get('brand-colors');

    this.brandColors = this.colorOptions
      .filter(({ value }) => (typeof brandColors === 'string' ? brandColors : '').split(',').includes(value))
      .map(({ token }) => token);

    this.notifyConfigChange({
      bodyFont: typeof bodyFont === 'string' ? bodyFont : '',
      headingFont: typeof headingFont === 'string' ? headingFont : '',
    });
  };

  get fontOptions() {
    return this.scrapedTokens
      .filter((token) => token.$type === 'fontFamily')
      .map((token) => {
        const { $extensions, $value } = token;
        const value = $value.join(', ');
        return {
          label: $extensions[EXTENSION_AUTHORED_AS],
          value,
        };
      });
  }

  get colorOptions() {
    return this.scrapedTokens
      .filter((token): token is ScrapedColorToken => token.$type === 'color' && Number(token.$value.alpha) === 1)
      .map((token) => {
        const { $extensions } = token;
        return {
          label: $extensions[EXTENSION_AUTHORED_AS],
          token: new ColorToken(token),
          value: $extensions[EXTENSION_TOKEN_ID],
        };
      });
  }

  override render() {
    return html`
      <div class="theme-sidebar">
        <h1 class="theme-sidebar__title">Theme Wizard</h1>

        <form @submit=${this.handleScrapeForm}>
          <section class="theme-sidebar__section">
            <h2 class="theme-sidebar__heading">Huisstijl URL</h2>

            <div class="theme-form-field">
              <label class="theme-form-field__label" for="source-url">Website URL</label>
              <input
                id="source-url"
                name="sourceUrl"
                class="theme-form-field__input"
                type="url"
                placeholder="https://example.com"
                .value=${this.sourceUrl || ''}
              />

              <utrecht-button appearance="primary-action-button" type="submit">Analyseer</utrecht-button>
            </div>
          </section>
        </form>

        <form class="theme-sidebar__form" @change=${this.handleThemeForm} @submit=${this.handleThemeForm}>
          <fieldset>
            <legend>Kleuren</legend>
            <color-select id="color-select" name="brand-colors" label="Basiskleuren" .options=${this.colorOptions}>
            </color-select>

            <fieldset>
              <legend>Kleurverlopen</legend>
              <output for="color-select">
                ${this.brandColors.map(
                  (token) => html`<color-scale .from=${token} .stops=${new ColorScale(token).list()}></color-scale>`,
                )}
              </output>
            </fieldset>
          </fieldset>

          <fieldset>
            <legend>Lettertypes</legend>
            <font-select
              name="heading-font"
              label="Koppen"
              value=${DEFAULT_TYPOGRAPHY.headingFont}
              optionsLabel="Opties uit opgegeven website"
              .options=${this.fontOptions}
            ></font-select>
            <font-select
              name="body-font"
              label="Lopende tekst"
              value=${DEFAULT_TYPOGRAPHY.bodyFont}
              optionsLabel="Opties uit opgegeven website"
              .options=${this.fontOptions}
            ></font-select>
          </fieldset>
          <utrecht-button appearance="primary-action-button" type="submit">Update</utrecht-button>
        </form>
      </div>
    `;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-sidebar': LitSidebar;
  }
}
