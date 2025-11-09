import { EXTENSION_TOKEN_ID, ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import Scraper from '../../lib/Scraper';
import styles from './styles';

@customElement('wizard-scraper')
export class WizardScraper extends LitElement {
  @property({ reflect: true }) src = '';
  @property({ reflect: true }) tokens: ScrapedDesignToken[] = [];
  error = '';
  #id = 'target-id';
  #scraper = new Scraper(document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '');

  static override readonly styles = [styles];

  readonly #handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const urlLike = formData.get(this.#id);

    try {
      const url = new URL(`${urlLike}`);
      this.tokens = await this.#scraper.getTokens(url);
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
    } catch {
      this.error = `Failed to scrape "${urlLike}"`;
    }
  };

  override render() {
    return html`
      <form @submit=${this.#handleSubmit}>
        <label for=${this.#id}>Website URL</label>
        <div>
          <input id=${this.#id} name=${this.#id} type="url" placeholder="https://example.com" value=${this.src} />
          <utrecht-button appearance="primary-action-button" type="submit">Analyseer</utrecht-button>
        </div>

        ${this.tokens.length
          ? html`
            <output>
              <details>
                <summary>${this.tokens.length} tokens found</summary>
                <ul>
                  ${this.tokens.map(
                    (token) => html`
                      <li>
                        ${token.$type === 'color'
                          ? html`
                            <span
                              style=${`background-color: ${ColorToken.getCSSColorFunction(token.$value)}`}>
                                &emsp;
                            </span> `
                          : nothing}
                          ${token.$extensions[EXTENSION_TOKEN_ID]}
                      </li>
                    `,
                  )}
                </ul>
            </output>`
          : nothing}
      </form>
    `;
  }
}
