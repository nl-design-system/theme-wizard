// TODO: import this when new version of MA is released
// import 'node_modules/@nl-design-system-community/ma-design-tokens/src/font.js';
// Then: remove these when importing from MA theme works
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/700.css';
// <End TODO>
import { provide } from '@lit/context';
import { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { scrapedColorsContext } from '../../contexts/scraped-colors';
import { themeContext } from '../../contexts/theme';
import PersistentStorage from '../../lib/PersistentStorage';
import Theme from '../../lib/Theme';
import { WizardScraper } from '../wizard-scraper';
import appStyles from './app.css';

/**
 * Router shell component - Provides Theme context and manages routing
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  readonly #storage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#storage.getJSON();
      if (tokens) {
        this.theme.tokens = tokens;
      }
    },
    prefix: 'theme-wizard',
  });
  readonly #theme = new Theme();

  @provide({ context: themeContext })
  @state()
  protected theme: Theme = this.#theme;

  @provide({ context: scrapedColorsContext })
  @state()
  scrapedColors: ScrapedColorToken[] = [];

  static override readonly styles = [appStyles];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();

    const previousTokens = this.#storage.getJSON();
    if (previousTokens) {
      this.theme.tokens = previousTokens;
    }

    this.addEventListener('change', this.#handleScrapeDone);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#handleScrapeDone);
  }

  readonly #handleScrapeDone = (event: Event) => {
    const target = event.target;
    if (!(target instanceof WizardScraper)) return;
    this.scrapedColors = target.colors;
  };

  override render() {
    return html`<slot></slot>`;
  }
}

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-app': App;
  }
}
