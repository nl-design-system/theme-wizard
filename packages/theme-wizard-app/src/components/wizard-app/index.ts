import { provide } from '@lit/context';
import { ClippyTokenCombobox } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { EXTENSION_TOKEN_ID, type ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import {
  EXTENSION_COLORSCALE_SEED,
  EXTENSION_TOKEN_STAGED,
  getExtension,
} from '@nl-design-system-community/design-tokens-schema';
import { defineCustomElements } from '@utrecht/web-component-library-stencil/loader/index.js';
import { dequal } from 'dequal';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { StagedDesignToken } from '../../utils/types';
import { completedStepsContext } from '../../contexts/completed-steps';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import PersistentStorage from '../../lib/PersistentStorage';
import Theme from '../../lib/Theme';
import {
  SET_THEME_TOKENS_EVENT,
  STAGE_SCRAPED_TOKEN_EVENT,
  STEPS_COMPLETED_EVENT,
  UPDATE_DESIGN_TOKENS_EVENT,
  type SetThemeTokensEvent,
  type StageScrapedTokenEvent,
  type StepsCompletedEvent,
  type SubmitSaveTokenFormEvent,
} from '../../utils/events';
import { WizardScraper } from '../wizard-scraper';
import componentStyles from './styles';

const tag = 'theme-wizard-app';

export type ThemeUpdateEvent = CustomEvent<{ theme: Theme }>;

declare global {
  interface DocumentEventMap {
    'theme-update': ThemeUpdateEvent;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardApp;
  }
}

@customElement(tag)
export class WizardApp extends LitElement {
  static override readonly styles = componentStyles;

  readonly #themeStorage = new PersistentStorage({
    onChange: () => {
      const tokens = this.#themeStorage.getJSON();
      this.theme.load(tokens);
      this.#forceUpdateTokens();
    },
    prefix: 'theme-wizard',
  });
  readonly #theme = new Theme();

  @provide({ context: themeContext })
  @state()
  theme: Theme = this.#theme;

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

  readonly #completedStepsStorage = new PersistentStorage({
    onChange: () => {
      this.completedSteps = this.#completedStepsStorage.getJSON() ?? [];
    },
    prefix: 'wizard-steps',
  });

  @provide({ context: completedStepsContext })
  @state()
  completedSteps: string[] = [];

  override connectedCallback() {
    super.connectedCallback();
    defineCustomElements();

    const previousThemeTokens = this.#themeStorage.getJSON();
    if (previousThemeTokens) {
      this.theme.load(previousThemeTokens);
    }

    const previousScrapedTokens = this.#scrapedTokensStorage.getJSON();
    if (previousScrapedTokens) {
      this.scrapedTokens = previousScrapedTokens;
    }

    const previousCompletedSteps = this.#completedStepsStorage.getJSON();
    if (Array.isArray(previousCompletedSteps)) {
      this.completedSteps = previousCompletedSteps;
    }

    this.addEventListener('wizard-scraper-done', this.#handleScrapeDone);
    this.addEventListener(UPDATE_DESIGN_TOKENS_EVENT, this.#handleUpdateTokens);
    this.addEventListener(SET_THEME_TOKENS_EVENT, this.#handleSetThemeTokens);
    this.addEventListener(STEPS_COMPLETED_EVENT, this.#handleStepsCompleted);
    this.addEventListener(STAGE_SCRAPED_TOKEN_EVENT, this.#handleStageScrapedToken);
    this.addEventListener('change', this.#handleTokenChange);
    this.addEventListener('reset', this.#handleReset);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('wizard-scraper-done', this.#handleScrapeDone);
    this.removeEventListener(UPDATE_DESIGN_TOKENS_EVENT, this.#handleUpdateTokens);
    this.removeEventListener(SET_THEME_TOKENS_EVENT, this.#handleSetThemeTokens);
    this.removeEventListener(STEPS_COMPLETED_EVENT, this.#handleStepsCompleted);
    this.removeEventListener(STAGE_SCRAPED_TOKEN_EVENT, this.#handleStageScrapedToken);
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

  readonly #handleUpdateTokens = (event: Event) => {
    const { detail } = event as SubmitSaveTokenFormEvent;
    this.theme.updateMany(detail.tokens);
    for (const { groupPath, seed } of detail.groupSeeds ?? []) {
      this.theme.setGroupExtension(groupPath, EXTENSION_COLORSCALE_SEED, seed);
    }
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
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

  readonly #handleStageScrapedToken = (event: Event) => {
    const { detail } = event as StageScrapedTokenEvent;
    this.scrapedTokens = this.scrapedTokens.map((token) => {
      if (getExtension(token, EXTENSION_TOKEN_ID) !== detail.id) {
        return token;
      }
      return { ...token, $extensions: { ...token.$extensions, [EXTENSION_TOKEN_STAGED]: detail.staged } };
    });
    this.#scrapedTokensStorage.setJSON(this.scrapedTokens);
  };

  readonly #handleSetThemeTokens = (event: Event) => {
    const { detail } = event as SetThemeTokensEvent;
    this.theme.load(detail.tokens);
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
    this.dispatchEvent(new Event('theme-upload'));
  };

  readonly #handleStepsCompleted = (event: Event) => {
    const { detail } = event as StepsCompletedEvent;
    const completedSteps = [...new Set([...this.completedSteps, ...detail.paths])];
    if (completedSteps.length === this.completedSteps.length) {
      return;
    }
    this.completedSteps = completedSteps;
    this.#completedStepsStorage.setJSON(this.completedSteps);
  };

  readonly #handleReset = () => {
    this.theme.reset();
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
    this.scrapedTokens = [];
    this.#scrapedTokensStorage.removeJSON();
    this.completedSteps = [];
    this.#completedStepsStorage.removeJSON();
    this.dispatchEvent(new Event('theme-reset'));
  };

  /**
   * @deprecated Use `this.handleUpdateTokens()` instead in the future.
   * This implies that all token changes should become `SubmitSaveTokenFormEvent` events.
   */
  readonly #handleTokenChange = async (event: Event) => {
    const target = event.composedPath().shift(); // @see https://lit.dev/docs/components/events/#shadowdom-retargeting

    let value;
    if (target instanceof ClippyTokenCombobox) {
      value = target.value?.$value;
    } else {
      return;
    }
    // Skip the costly update when the value did not actually change
    if (dequal(this.theme.at(target.name)?.$value, value)) {
      return;
    }
    this.theme.updateAt(target.name, value);
    this.#forceUpdateTokens();
    this.#themeStorage.setJSON(this.theme.tokens);
  };

  override render() {
    return html`<slot></slot>`;
  }
}
