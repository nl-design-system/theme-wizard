import type { ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { provide } from '@lit/context';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { dequal } from 'dequal';
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
    this.addEventListener('reset-tokens', this.#handlePresetResetTokens as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('wizard-scraper-done', this.#handleScrapeDone);
    this.removeEventListener('change', this.#handleTokenChange);
    this.removeEventListener('reset', this.#handleReset);
    this.removeEventListener('reset-tokens', this.#handlePresetResetTokens as EventListener);
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

    this.scrapedTokens = result.map((token) => ({
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

  readonly #handlePresetResetTokens = (event: CustomEvent<{ paths: string[] }>) => {
    const { paths } = event.detail;
    if (!paths || paths.length === 0) return;

    this.theme.resetMany(paths);
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  /**
   * Reads the current DOM state of all selected preset groups in the wizard
   * and converts their `value` payloads into one combined list of token updates.
   *
   * Example DOM state:
   * - `<wizard-token-preset selected value={ { nl: { paragraph: { 'font-size': { $value: '{basis.text.font-size.lg}' } } } }} />`
   * - `<wizard-token-preset selected value={ { nl: { paragraph: { lead: { 'font-size': { $value: '{basis.text.font-size.xl}' } } } }} } />`
   *
   * Example return:
   * `[
   *   { path: 'nl.paragraph.font-size', value: '{basis.text.font-size.lg}' },
   *   { path: 'nl.paragraph.lead.font-size', value: '{basis.text.font-size.xl}' }
   * ]`
   */
  readonly #getSelectedPresetUpdates = () =>
    Array.from(this.querySelectorAll<WizardTokenPreset>('wizard-token-preset[selected]')).flatMap((preset) =>
      presetTokensToUpdateMany(preset.value),
    );

  readonly #applyColorscaleUpdates = (target: WizardColorscaleInput) => {
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

    return updates.length > 0;
  };

  readonly #applyComboboxUpdate = (target: WizardTokenCombobox) => {
    if (dequal(this.theme.at(target.name)?.$value, target.value?.$value)) {
      return false;
    }

    this.theme.updateAt(target.name, target.value?.$value);
    return true;
  };

  readonly #applyTokenInputUpdate = (target: WizardTokenInput) => {
    if (dequal(this.theme.at(target.name)?.$value, target.value)) {
      return false;
    }

    this.theme.updateAt(target.name, target.value);
    return true;
  };

  /**
   * Applies the currently selected preset groups to the theme in one combined update.
   *
   * What happens here:
   * - all selected `wizard-token-preset` elements are read from the current DOM state
   * - their token payloads are flattened into `{ path, value }` updates
   * - updates that are already equal to the current theme values are filtered out
   * - the remaining updates are written to the theme together via `theme.updateMany(...)`
   *
   * This keeps dependent presets in sync, for example when one preset group derives its value
   * from another selected preset group.
   *
   * Returns:
   * - `true` when one or more token values were actually changed
   * - `false` when all selected preset values already matched the current theme
   */
  readonly #applyPresetUpdates = () => {
    const updates = this.#getSelectedPresetUpdates().filter(
      ({ path, value }) => !dequal(this.theme.at(path)?.$value, value),
    );

    if (updates.length === 0) {
      return false;
    }

    this.theme.updateMany(updates);
    return true;
  };

  /**
   * Handles change events from token-editing controls and writes the resulting values to the current theme.
   *
   * Supported event targets:
   * - `WizardColorscaleInput`: updates a full color scale and its inverse counterpart
   * - `WizardTokenCombobox`: updates one token from a selected token reference
   * - `WizardTokenInput`: updates one token from a manually entered value
   * - `WizardTokenPreset`: updates the theme from all currently selected preset groups
   *
   * After applying updates, this handler:
   * - refreshes the reactive theme instance
   * - dispatches a `theme-update` event
   * - persists the updated theme to storage
   */
  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting
    let hasChanges = false;

    if (target instanceof WizardColorscaleInput) {
      hasChanges = this.#applyColorscaleUpdates(target);
    } else if (target instanceof WizardTokenCombobox) {
      hasChanges = this.#applyComboboxUpdate(target);
    } else if (target instanceof WizardTokenInput) {
      hasChanges = this.#applyTokenInputUpdate(target);
    } else if (target instanceof WizardTokenPreset) {
      hasChanges = this.#applyPresetUpdates();
    } else {
      console.warn('Unhandled token change event target', target);
      return;
    }

    if (!hasChanges) {
      return;
    }

    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  override render() {
    return html`<slot></slot>`;
  }
}
