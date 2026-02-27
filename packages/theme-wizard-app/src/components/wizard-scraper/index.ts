import { ScrapedDesignToken, resolveUrl } from '@nl-design-system-community/css-scraper';
import formFieldStyles from '@utrecht/form-field-css?inline';
import formLabelStyles from '@utrecht/form-label-css?inline';
import textboxStyles from '@utrecht/textbox-css?inline';
import { html, LitElement, unsafeCSS, nothing, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { t } from '../../i18n';
import PersistentStorage from '../../lib/PersistentStorage';
import Scraper from '../../lib/Scraper';
import styles from './styles';

const OPTIONS_STORAGE_KEY = 'options';
const SRC_STORAGE_KEY = 'src';

const tag = 'wizard-scraper';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardScraper;
  }
}

@customElement(tag)
export class WizardScraper extends LitElement {
  @property({ type: Array }) tokens: ScrapedDesignToken[] = [];
  @property() scraperUrl?: string;
  readonly #storage = new PersistentStorage({ prefix: 'theme-wizard-scraper' });
  #options: ScrapedDesignToken[] = [];
  error: string | TemplateResult = '';
  readonly #id = 'target-id';
  #scraper?: Scraper;
  #src: string = '';
  #state: 'idle' | 'pending' | 'error' | 'success' = 'idle';
  readonly #errorMessageId = 'scraper-error-message';
  readonly #statusMessageId = 'scraper-status-message';

  static override readonly styles = [
    styles,
    unsafeCSS(formFieldStyles),
    unsafeCSS(textboxStyles),
    unsafeCSS(formLabelStyles),
  ];

  constructor() {
    super();
    this.options = this.#storage.getJSON(OPTIONS_STORAGE_KEY) || [];
    this.src = this.#storage.getItem(SRC_STORAGE_KEY) || '';
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.scraperUrl) {
      this.#scraper = new Scraper(this.scraperUrl);
    }
  }

  override firstUpdated() {
    if (this.options.length) {
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
      this.#state = 'success';
    }
  }

  get options() {
    return this.#options;
  }

  set options(options: ScrapedDesignToken[]) {
    this.#storage.setJSON(OPTIONS_STORAGE_KEY, options);
    this.#options = options;
    this.requestUpdate();
  }

  @property({ reflect: true })
  get src() {
    return this.#src || '';
  }

  set src(value: string) {
    this.#storage.setItem(SRC_STORAGE_KEY, value);
    this.#src = value;
  }

  readonly #handleScrape = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const formData = new FormData(form);
    const urlLike = resolveUrl(formData.get(this.#id)?.toString() || '');

    if (!urlLike) {
      this.error = t(`scraper.invalidUrl`);
      this.#state = 'error';
      this.requestUpdate();
      return;
    }

    if (!this.#scraper) return;

    try {
      this.#state = 'pending';
      const url = new URL(urlLike);
      this.options = await this.#scraper.getTokens(url);
      this.dispatchEvent(new Event('change', { bubbles: true }));
      this.src = url.toString();
      this.#state = 'success';
    } catch {
      this.options = [];
      this.error = t('scraper.scrapeFailed', { url: urlLike });
      this.#state = 'error';
    }
  };

  override render() {
    return html`
      <form
        @submit=${this.#handleScrape}
        class="utrecht-form-field utrecht-form-field--text ${classMap({
          'utrecht-form-field--invalid': this.#state === 'error',
        })}"
      >
        <div class="utrecht-form-label">
          <label for=${this.#id} class="utrecht-form-label">${t('scraper.input.label')}</label>
        </div>
        <div class="wizard-scraper__input utrecht-form-field__input">
          <input
            class="utrecht-textbox utrecht-textbox--html-input"
            id=${this.#id}
            name=${this.#id}
            type="text"
            inputmode="url"
            placeholder="gemeentevoorbeeld.nl"
            value=${this.src}
            aria-invalid=${this.#state === 'error' ? 'true' : nothing}
            aria-errormessage=${this.#state === 'error' ? this.#errorMessageId : nothing}
            aria-describedby=${this.#state === 'success' ? this.#statusMessageId : nothing}
            data-state=${this.#state}
          />
          <utrecht-button appearance="primary-action-button" type="submit"> ${t('scraper.submit')} </utrecht-button>
        </div>
        ${this.#state === 'error'
          ? html`
              <utrecht-form-field-error-message id=${this.#errorMessageId} class="utrecht-form-field__error-message">
                <utrecht-paragraph class="utrecht-form-field-error-message">${this.error}</utrecht-paragraph>
              </utrecht-form-field-error-message>
            `
          : nothing}
        ${this.#state === 'success'
          ? html`
              <utrecht-paragraph role="status" id=${this.#statusMessageId}>
                ${t('scraper.success', { tokenCount: this.options.length })}
              </utrecht-paragraph>
            `
          : nothing}
      </form>
    `;
  }
}
