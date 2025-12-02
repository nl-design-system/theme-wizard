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
import '../color-select';
import '../color-scale-picker';
import '../wizard-token-scraper';
import sidebarStyles from './sidebar.css';

@customElement('theme-wizard-sidebar')
export class LitSidebar extends LitElement {
  @property() sourceUrl = DEFAULT_CONFIG.sourceUrl;
  @property() headingFont = DEFAULT_CONFIG.headingFont;
  @property() bodyFont = DEFAULT_CONFIG.bodyFont;
  @property({ attribute: false }) onResetTheme?: () => void;

  @state() brandColors: ColorToken[] = [];

  @property() scrapedTokens: ScrapedDesignToken[] = [];

  static override readonly styles = [sidebarStyles];

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener(EVENT_NAMES.SCRAPE_COMPLETE, this.#handleScrapeForm);
  }

  readonly #handleScrapeForm = (event: Event): void => {
    if (!(event instanceof CustomEvent)) return;
    this.scrapedTokens = event.detail;
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

        <section class="theme-sidebar__section">
          <h2>1. Analyseer je website</h2>
          <wizard-token-scraper></wizard-token-scraper>
        </section>

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
