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
import appStyles from './app.css';

/**
 * Router shell component - Provides Theme context
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  readonly #storage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#storage.getJSON();
      console.log('storage updated');
      if (tokens) {
        this.theme.tokens = tokens;
        const newTheme = new Theme();
        newTheme.tokens = this.theme.tokens;
        newTheme.stylesheet = this.theme.stylesheet;
        this.theme = newTheme;
      } else {
        const newTheme = new Theme();
        newTheme.tokens = {};
        newTheme.stylesheet = this.theme.stylesheet;
        this.theme = newTheme;
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

  /**
   * @description This function forcefully replaces this.theme with a new object. This is needed to tell
   * the enitre subtree of this element that the theme and tokens have changed. If we don't do this, the
   * subtree will not know that .tokens was updated and will not rerender themselves.
   */
  readonly #forceUpdateTokens = (newTokens?: Theme['tokens']) => {
    const newTheme = new Theme();
    newTheme.stylesheet = this.theme.stylesheet;
    if (newTokens) {
      newTheme.tokens = newTokens;
    }
    this.theme = newTheme;
    this.requestUpdate();
  };

  readonly #handleScrapeDone = (event: Event) => {
    const target = event.target;
    if (!(target instanceof WizardScraper)) return;
    this.scrapedColors = target.colors;
  };

  readonly #handleReset = () => {
    this.theme.reset();
    // Force context update by creating a new Theme instance with current tokens
    const newTheme = new Theme();
    newTheme.tokens = this.theme.tokens;
    newTheme.stylesheet = this.theme.stylesheet;
    this.theme = newTheme;
    this.#storage.setJSON(newTheme.tokens);
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

    console.log('updated');

    // Force context update by creating a new Theme instance with current tokens
    const newTheme = new Theme();
    newTheme.tokens = this.theme.tokens;
    // newTheme.tokens = this.theme.tokens;
    newTheme.stylesheet = this.theme.stylesheet;
    this.theme = newTheme;

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
