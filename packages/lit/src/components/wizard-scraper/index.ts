import { EXTENSION_TOKEN_ID, ScrapedDesignToken } from '@nl-design-system-community/css-scraper';
import formFieldStyles from '@utrecht/form-field-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
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

  static override readonly styles = [styles, unsafeCSS(formFieldStyles), unsafeCSS(textboxStyles)];

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
        <div class="utrecht-form-field utrecht-form-field--text">
          <label for=${this.#id} class="utrecht-form-field__label">Website URL</label>
          <div className="utrecht-form-field__description"></div>
          <div class="wizard-scraper__input utrecht-form-field__input">
            <input
              class="utrecht-textbox utrecht-textbox--html-input"
              id=${this.#id}
              name=${this.#id}
              type="text"
              placeholder="example.com"
              value=${this.src}
            />
            <utrecht-button appearance="primary-action-button" type="submit">Analyseer</utrecht-button>
          </div>
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
                              <span style=${`background-color: ${ColorToken.getCSSColorFunction(token.$value)}`}>
                                &emsp;
                              </span>
                            `
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
