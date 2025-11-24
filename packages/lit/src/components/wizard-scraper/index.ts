import { EXTENSION_TOKEN_ID, ScrapedColorToken, ScrapedDesignToken, ScrapedFontFamilyToken } from '@nl-design-system-community/css-scraper';
import formFieldStyles from '@utrecht/form-field-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorToken from '../../lib/ColorToken';
import PersistentStorage from '../../lib/PersistentStorage';
import Scraper from '../../lib/Scraper';
import styles from './styles';

const OPTIONS_STORAGE_KEY = 'options';

@customElement('wizard-scraper')
export class WizardScraper extends LitElement {
  @property({ reflect: true }) src = '';
  @property() tokens: ScrapedDesignToken[] = [];
  #storage = new PersistentStorage({ prefix: 'theme-wizard-scraper' });
  #options: ScrapedDesignToken[] = [];
  #colors: ScrapedColorToken[] = [];
  #fonts: ScrapedFontFamilyToken[] = [];
  error = '';
  #id = 'target-id';
  #scraper = new Scraper(document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '');

  static override readonly styles = [styles, unsafeCSS(formFieldStyles), unsafeCSS(textboxStyles)];

  constructor() {
    super();
    this.options = this.#storage.getJSON(OPTIONS_STORAGE_KEY);
  }

  get options() {
    return this.#options
  }

  set options(options: ScrapedDesignToken[]) {
    this.#storage.setJSON(OPTIONS_STORAGE_KEY, options);
    this.#options = options;
    this.#colors = options.filter((color): color is ScrapedColorToken => color.$type === 'color' );
    this.#fonts = options.filter((font): font is ScrapedFontFamilyToken => font.$type === 'fontFamily');
    this.requestUpdate();
  }

  get colors() {
    return this.#colors;
  }

  get fonts() {
    return this.#fonts;
  }

  readonly #handleScrape = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const formData = new FormData(form);
    const urlLike = formData.get(this.#id);

    try {
      const url = new URL(`${urlLike}`);
      this.options = await this.#scraper.getTokens(url);
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
    } catch {
      this.error = `Failed to scrape "${urlLike}"`;
    }
  };

  readonly #handleOptionClick = async (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    // this.tokens.push(target.value);
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );
  }

  override render() {
    return html`
      <div>
        <form @submit=${this.#handleScrape} class="utrecht-form-field utrecht-form-field--text">
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
        </form>

        ${this.#colors.length
          ? html`
            <output>
              <details>
                <summary>${this.#colors.length} Colors</summary>
                <ul>
                  ${this.#colors.map(
                    (token) => html`
                      <li>
                        <button class="wizard-scraper__color" @click=${this.#handleOptionClick} value=${token.$extensions[EXTENSION_TOKEN_ID]}>
                        ${token.$type === 'color'
                          ? html`
                              <span style=${`background-color: ${ColorToken.getCSSColorFunction(token.$value)}`}>
                                &emsp;
                              </span>
                            `
                          : nothing}
                        ${token.$extensions[EXTENSION_TOKEN_ID]}
                        </button>
                      </li>
                    `,
                  )}
                </ul>
            </output>`
          : nothing}
      </div>
    `;
  }
}
