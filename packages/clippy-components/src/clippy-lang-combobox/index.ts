import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ClippyCombobox } from '../clippy-combobox';
import languages, { type LangCode } from './languages';

type Option = {
  value: string;
  label: string;
  autonym: string;
  exonym: string;
};

const FORMAT_OPTIONS = ['both', 'autonym', 'exonym'] as const;
const DEFAULT_FORMAT_OPTION = FORMAT_OPTIONS[0];
type Format = typeof FORMAT_OPTIONS[number];

const DEFAULT_LANG = 'en';

const DEFAULT_SEPARATOR = '–';

const tag = 'clippy-lang-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLangCombobox;
  }
}

@customElement(tag)
export class ClippyLangCombobox extends ClippyCombobox<Option> {
  #options: Option[] = [];
  #lang?: string;
  exonyms = new Intl.DisplayNames(DEFAULT_LANG, { type: 'language' });
  @property() separator = DEFAULT_SEPARATOR;
  @property({
    converter: {
      fromAttribute: (value: string | null): Format =>
        FORMAT_OPTIONS.find(v => v === value) || DEFAULT_FORMAT_OPTION
    },
    type: String
  }) format: Format = DEFAULT_FORMAT_OPTION;

  static readonly autonyms = { of: (code: string) => languages[code as LangCode] }; // static because not dependent on instance
  readonly autonyms = { of: ClippyLangCombobox.autonyms.of }; // consistent api with exonyms for convenience

  @property()
  override get lang() {
    return this.#lang || DEFAULT_LANG;
  }

  override set lang(value: string) {
    if (value !== this.#lang) {
      this.#lang = value;
      this.exonyms = new Intl.DisplayNames(DEFAULT_LANG, { type: 'language' });
    }
  }

  @property({ type: Array })
  override get options(): Option[] {
    return this.#options;
  }

  override set options(options: string[]) {
    this.#options = options.map((value) => {
      const autonym = this.autonyms.of(value);
      const exonym = this.exonyms.of(value) || autonym; // fallback to autonym if exonym fails
      const option = {
        autonym,
        exonym,
        value,
      };
      const label = (this.format === 'both')
        ? `${option.autonym} ${option.exonym !== option.autonym ? option.exonym : ''}`
        : option?.[this.format];
      return {
        ...option,
        label
      }
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // we need a language to use the correct translation, look for closest ancestor with lang attribute.
    const LANG_ATTR = 'lang';
    let lang = this.#lang || this.getAttribute(LANG_ATTR);
    if (!lang) {
      let element = this.parentElement;
      while (element) {
        if (element.hasAttribute(LANG_ATTR)) {
          lang = element.getAttribute(LANG_ATTR) || lang;
          break;
        }
        element = element.parentElement;
      }
    }
    console.log(lang);
    this.lang = lang || DEFAULT_LANG;
  }

  override renderEntry(option: Option) {
    const isCurrentLanguage = option.value === this.lang;
    const exonym = (isCurrentLanguage || ['both', 'exonym'].includes(this.format))
      ? html`<spanclass="clippy-lang-combobox__exonym">${option.exonym}</span>`
      : nothing;
    const autonym = (!isCurrentLanguage && ['both', 'autonym'].includes(this.format))
      ? html`<span class="clippy-lang-combobox__autonym" lang=${option.value}>${option.autonym}</span>`
      : nothing;

    const separator = !(exonym === nothing || autonym === nothing)
      ? html`<span role="presentation">${this.separator}</span>`
      : nothing;

    return html`
      <span class="clippy-lang-combobox__option">
        ${exonym} ${separator} ${autonym}
      </span>
    `;
  }
}
