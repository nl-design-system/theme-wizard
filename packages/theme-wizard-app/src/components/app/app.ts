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
import { WizardColorscaleInput } from '../wizard-colorscale-input';
import { WizardScraper } from '../wizard-scraper';
import { WizardTokenInput } from '../wizard-token-input';
import { WizardTokensForm } from '../wizard-tokens-form';
import appStyles from './app.css';

/**
 * Router shell component - Provides Theme context
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  readonly #storage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#storage.getJSON();
      if (tokens) {
        this.theme.tokens = tokens;
        // Request update to show new validation warnings and to update the inputs with their new values
        this.requestUpdate();
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
    this.addEventListener('change', this.#handleTokenChange);
    this.addEventListener('reset', this.#handleReset);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#handleScrapeDone);
    this.removeEventListener('change', this.#handleTokenChange);
    this.removeEventListener('reset', this.#handleReset);
  }

  readonly #handleScrapeDone = (event: Event) => {
    const target = event.target;
    if (!(target instanceof WizardScraper)) return;
    this.scrapedColors = target.colors;
  };

  readonly #handleReset = (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting
    if (!(target instanceof WizardTokensForm)) return;

    this.theme.reset();
    this.#storage.removeJSON();
    this.requestUpdate();
  };

  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting
    if (!(target instanceof WizardTokenInput)) return;

    if (target instanceof WizardColorscaleInput) {
      const updates = Object.entries(target.value).map(([colorKey, value]) => ({
        path: `${target.name}.${colorKey}`,
        value: value.$value,
      }));
      this.theme.updateMany(updates);
    } else {
      this.theme.updateAt(target.name, target.value);
    }

    // Request update to reflect any new validation issues
    this.requestUpdate();
    this.#storage.setJSON(this.theme.tokens);
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
