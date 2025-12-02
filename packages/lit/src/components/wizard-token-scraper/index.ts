import { EXTENSION_USAGE_COUNT, ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { LitElement, html } from 'lit';
import '../wizard-color-input';
import '../wizard-font-input';
import '../wizard-token-input';
import { customElement } from 'lit/decorators.js';
import { EVENT_NAMES } from '../../constants';
import Scraper from '../../lib/Scraper';
import { isValidUrl } from '../../utils';
import styles from './styles';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardTokenScraper;
  }
}

const tag = 'wizard-token-scraper';

@customElement(tag)
export class WizardTokenScraper extends LitElement {
  static override readonly styles = [styles];

  private readonly scraper: Scraper = new Scraper(
    document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '',
  );

  private notifyChange(tokens: ScrapedDesignToken[]) {
    const event = new CustomEvent(EVENT_NAMES.SCRAPE_COMPLETE, {
      bubbles: true,
      composed: true,
      detail: tokens,
    });
    this.dispatchEvent(event);
  }

  private async handleScrapeForm(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const sourceUrl = formData.get('sourceUrl') as string;

    if (sourceUrl?.trim() && !isValidUrl(sourceUrl)) {
      return;
    }

    await this.scrapeTokens(sourceUrl);
  }

  private async scrapeTokens(sourceUrl: string) {
    try {
      const tokens = await this.scraper.getTokens(new URL(sourceUrl));
      const sortedTokens = [...tokens].sort(
        (a, b) => b.$extensions[EXTENSION_USAGE_COUNT] - a.$extensions[EXTENSION_USAGE_COUNT],
      );
      this.notifyChange(sortedTokens);

      this.requestUpdate();
    } catch (error) {
      console.error('Failed to analyze website:', error);
    }
  }

  override render() {
    return html`
      <form @submit=${this.handleScrapeForm} class="theme-sidebar__form theme-sidebar__form--single-line">
        <label class="theme-form-field__label" for="source-url">Website URL</label>
        <input
          id="source-url"
          name="sourceUrl"
          class="theme-form-field__input"
          type="text"
          inputmode="url"
          placeholder="https://example.com"
        />
        <utrecht-button appearance="primary-action-button" type="submit">Analyseer</utrecht-button>
      </form>
    `;
  }
}
