import type {
  ScrapedColorToken,
  ScrapedDesignToken,
  ScrapedFontFamilyToken,
} from '@nl-design-system-community/css-scraper/design-tokens';
import { resolveUrl } from '@nl-design-system-community/css-scraper/design-tokens';
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

@customElement('wizard-scraper')
export class WizardScraper extends LitElement {
  @property() tokens: ScrapedDesignToken[] = [];
  readonly #storage = new PersistentStorage({ prefix: 'theme-wizard-scraper' });
  #options: ScrapedDesignToken[] = [];
  #colors: ScrapedColorToken[] = [];
  #fonts: ScrapedFontFamilyToken[] = [];
  error: string | TemplateResult = '';
  readonly #id = 'target-id';
  readonly #scraper = new Scraper(document.querySelector('meta[name=scraper-api]')?.getAttribute('content') || '');
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

  get options() {
    return this.#options;
  }

  set options(options: ScrapedDesignToken[]) {
    this.#storage.setJSON(OPTIONS_STORAGE_KEY, options);
    this.#options = options;
    this.#colors = options.filter((color): color is ScrapedColorToken => color.$type === 'color');
    this.#fonts = options.filter((font): font is ScrapedFontFamilyToken => font.$type === 'fontFamily');
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
    const urlLike = resolveUrl(formData.get(this.#id)?.toString() || '');

    if (!urlLike) {
      this.error = t(`scraper.invalidUrl`);
      this.#state = 'error';
      this.requestUpdate();
      return;
    }

    try {
      this.#state = 'pending';
      const url = new URL(urlLike);
      this.options = await this.#scraper.getTokens(url);
      this.dispatchEvent(
        new Event('change', {
          bubbles: true,
        }),
      );
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
              <utrecht-paragraph role="status" id="#statusMessageId">
                ${t('scraper.success', { tokenCount: this.colors.length + this.fonts.length })}
              </utrecht-paragraph>
            `
          : nothing}
      </form>
    `;
  }
}
