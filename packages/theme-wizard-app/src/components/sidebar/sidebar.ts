import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_TOKEN_ID,
  type ScrapedDesignToken,
  type ScrapedColorToken,
} from '@nl-design-system-community/css-scraper';
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EVENT_NAMES } from '../../constants';
import { DEFAULT_CONFIG } from '../../constants/default';
import ColorToken from '../../lib/ColorToken';
import { isValidUrl } from '../../utils';
import sidebarStyles from './sidebar.css';
import '../color-select';
import '../color-scale-picker';
import '../wizard-scraper';

@customElement('theme-wizard-sidebar')
export class LitSidebar extends LitElement {
  @property() sourceUrl = DEFAULT_CONFIG.sourceUrl;
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

  readonly #handleScrape = (event: Event): void => {
    event.preventDefault();
  };

  private readonly handleThemeForm = (event: Event): void => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const brandColors = formData.get('brand-colors');
    // @TODO: Use defined color scales
    // const colorScales = formData.getAll('color-scale');

    this.brandColors = this.colorOptions
      .filter(({ value }) => (typeof brandColors === 'string' ? brandColors : '').split(',').includes(value))
      .map(({ token }) => token);
  };

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

        <wizard-scraper @submit=${this.#handleScrape}></wizard-scraper>

        <form class="theme-sidebar__form" @change=${this.handleThemeForm} @submit=${this.handleThemeForm}>
          <color-select
            id="color-select"
            name="brand-colors"
            label="Basiskleuren"
            .options=${this.colorOptions}
          ></color-select>
        </form>

        <slot></slot>
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
