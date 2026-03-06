import { provide } from '@lit/context';
import { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import PersistentStorage from '../../lib/PersistentStorage';
import Theme from '../../lib/Theme';
import { WizardColorscaleInput } from '../wizard-colorscale-input';
import { WizardScraper } from '../wizard-scraper';
import { WizardTokenCombobox } from '../wizard-token-combobox';
import { WizardTokenInput } from '../wizard-token-input';

/**
 * Router shell component - Provides Theme context
 */
@customElement('theme-wizard-app')
export class App extends LitElement {
  readonly #themeStorage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#themeStorage.getJSON();
      this.theme.tokens = tokens;
      this.#forceUpdateTokens();
    },
    prefix: 'theme-wizard',
  });
  readonly #theme = new Theme();

  @provide({ context: themeContext })
  @state()
  protected theme: Theme = this.#theme;

  readonly #scrapedTokensStorage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#scrapedTokensStorage.getJSON();
      this.scrapedTokens = tokens;
    },
    prefix: 'scraped-tokens',
  });
  @provide({ context: scrapedTokensContext })
  @state()
  scrapedTokens: ScrapedDesignToken[] = [];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();

    const previousThemeTokens = this.#themeStorage.getJSON();
    if (previousThemeTokens) {
      this.theme.tokens = previousThemeTokens;
    }

    const previousScrapedTokens = this.#scrapedTokensStorage.getJSON();
    if (previousScrapedTokens) {
      this.scrapedTokens = previousScrapedTokens;
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
   * @description Lit context only detects reference changes, not nested properties. New instance triggers updates; preserved stylesheet keeps preview styling of preview intact.
   */
  readonly #forceUpdateTokens = () => {
    const newTheme = new Theme(undefined, this.theme.stylesheet);
    newTheme.tokens = this.theme.tokens;
    this.theme = newTheme;
    this.requestUpdate();
  };

  readonly #handleScrapeDone = (event: Event) => {
    const target = event.target;
    if (!(target instanceof WizardScraper)) return;
    this.scrapedTokens = target.options;
    this.#scrapedTokensStorage.setJSON(target.options);
  };

  readonly #handleReset = () => {
    this.theme.reset();
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting
    if (!(target instanceof WizardTokenInput || target instanceof WizardTokenCombobox)) return;
    if (target instanceof WizardColorscaleInput) {
      const scaleColors = Object.values(target.value);
      const reversedScale = scaleColors.toReversed();

      // Set regular and inversed scale simultaneously
      // We know this is not the exact desired behaviour but it'll do for now
      const updates = Object.entries(target.value).flatMap(([colorKey, value], index) => {
        return [
          {
            path: `${target.name}.${colorKey}`,
            value: value.$value,
          },
          {
            path: `${target.name}-inverse.${colorKey}`,
            value: reversedScale.at(index)?.$value,
          },
        ];
      });
      this.theme.updateMany(updates);
    } else if (target instanceof WizardTokenCombobox) {
      this.theme.updateAt(target.name, target.value?.$value);
    } else if (target instanceof WizardTokenInput) {
      this.theme.updateAt(target.name, target.value);
    }
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
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
