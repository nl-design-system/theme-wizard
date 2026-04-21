import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { provide } from '@lit/context';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { getSiblingGroupsWithOnlyRefsTo } from '../../lib/ColorScale/siblings';
import PersistentStorage from '../../lib/PersistentStorage';
import Theme from '../../lib/Theme';
import { presetTokensToUpdateMany } from '../../lib/Theme/lib';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils/types';
import { WizardColorscaleInput, EXTENSION_COLORSCALE_SEED } from '../wizard-colorscale-input';
import { WizardScraper } from '../wizard-scraper';
import { WizardTokenCombobox } from '../wizard-token-combobox';
import { WizardTokenInput } from '../wizard-token-input';
import { WizardTokenPreset } from '../wizard-token-presets';

const tag = 'theme-wizard-app';

export type ThemeUpdateEvent = CustomEvent<{ theme: Theme }>;

declare global {
  interface DocumentEventMap {
    'theme-update': ThemeUpdateEvent;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    [tag]: App;
  }
}

@customElement(tag)
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
  scrapedTokens: StagedDesignToken[] = [];

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

    this.addEventListener('wizard-scraper-done', this.#handleScrapeDone);
    this.addEventListener('change', this.#handleTokenChange);
    this.addEventListener('reset', this.#handleReset);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('wizard-scraper-done', this.#handleScrapeDone);
    this.removeEventListener('change', this.#handleTokenChange);
    this.removeEventListener('reset', this.#handleReset);
  }

  /**
   * @description Lit context only detects reference changes, not nested properties. New instance triggers updates; preserved stylesheet keeps preview styling of preview intact.
   */
  readonly #forceUpdateTokens = () => {
    this.theme = this.theme.clone();
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('theme-update', { bubbles: true, detail: { theme: this.theme } }));
  };

  readonly #handleScrapeDone = (event: Event) => {
    if (!(event.target instanceof WizardScraper)) return;
    const { result } = (event as CustomEvent<{ result: ScrapedDesignToken[] }>).detail;

    this.scrapedTokens = result
      .filter((token) => {
        // Skip colors with transparency
        if (token.$type === 'color' && token.$value.alpha !== undefined && token.$value.alpha < 1) {
          return false;
        }
        return true;
      })
      .map((token) => ({
        ...token,
        $extensions: {
          ...token.$extensions,
          [EXTENSION_TOKEN_STAGED]: true,
        },
      }));
    this.#scrapedTokensStorage.setJSON(this.scrapedTokens);
    this.dispatchEvent(new Event('scrape-success'));
  };

  readonly #handleReset = () => {
    this.theme.reset();
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting

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

      // Add $extensions for seed-color for the changed token, as well as for any siblings
      // that exclusively point to the changed token's values.
      // -> accent-2 points exclusively to accent-1, so update accent-2's seed-color as well
      const nameParts = target.name.split('.'); // e.g. ['basis', 'color', 'accent-1']
      const parentGroup = nameParts.length > 1 ? this.theme.at(nameParts.slice(0, -1).join('.')) : null; // e.g. basis.color group
      const siblingGroupsWithOnlyRefsToSelf = getSiblingGroupsWithOnlyRefsTo(target.name, parentGroup);

      // Set the seed on the updated group and any siblings that exclusively reference it
      for (const groupPath of [target.name, ...siblingGroupsWithOnlyRefsToSelf]) {
        this.theme.setGroupExtension(groupPath, EXTENSION_COLORSCALE_SEED, target.seedColor);
      }
    } else if (target instanceof WizardTokenCombobox) {
      this.theme.updateAt(target.name, target.value?.$value);
    } else if (target instanceof WizardTokenInput) {
      this.theme.updateAt(target.name, target.value);
    } else if (target instanceof WizardTokenPreset) {
      const updates = presetTokensToUpdateMany(target.value);
      this.theme.updateMany(updates);
    } else {
      return;
    }
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  override render() {
    return html`<slot></slot>`;
  }
}
