import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ClippyCombobox } from '../clippy-combobox';
import languages, { type LangCode } from './languages';
import LocalizationMixin from '@src/lib/LocalizationMixin';
import { arrayFromTokenList } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';

type Option = {
  value: string;
  label: string;
  autonym: string;
  exonym: string;
};

const FORMAT_OPTIONS = ['both', 'autonym', 'exonym'] as const;
const DEFAULT_FORMAT_OPTION = FORMAT_OPTIONS[0];
type Format = (typeof FORMAT_OPTIONS)[number];

const DEFAULT_SEPARATOR = '-';

const tag = 'clippy-lang-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyLangCombobox;
  }
}

// Flatten the generic before applying the mixin to ensure type compatibility.
class C extends ClippyCombobox<Option> {}

@safeCustomElement(tag)
export class ClippyLangCombobox extends LocalizationMixin(C) {
  #options: Option[] = [];
  #lang?: string;
  exonyms = new Intl.DisplayNames(this.DEFAULT_LANG, { type: 'language' });
  @property() separator = DEFAULT_SEPARATOR;
  @property({
    converter: {
      fromAttribute: (value: string | null): Format => FORMAT_OPTIONS.find((v) => v === value) || DEFAULT_FORMAT_OPTION,
    },
    type: String,
  })
  format: Format = DEFAULT_FORMAT_OPTION;

  static readonly autonyms = { of: (code: string) => languages[code as LangCode] }; // static because not dependent on instance
  readonly autonyms = { of: ClippyLangCombobox.autonyms.of }; // consistent api with exonyms for convenience

  @property()
  override set lang(value: string) {
    if (value !== this.#lang) {
      this.#lang = value;
      this.exonyms = new Intl.DisplayNames(value, { type: 'language' });
    }
  }

  override get lang() {
    return this.#lang || this.DEFAULT_LANG;
  }
  @property({ converter: arrayFromTokenList, type: Array })
  override set options(options: string[]) {
    this.#options = options.map((value) => {
      const autonym = this.autonyms.of(value);
      const exonym = this.exonyms.of(value) || autonym; // fallback to autonym if exonym fails
      const option = {
        autonym,
        exonym,
        value,
      };
      const exonymIfDifferent = option.exonym === option.autonym ? '' : option.exonym;
      const label = this.format === 'both' ? `${option.autonym} ${exonymIfDifferent}` : option?.[this.format];
      return {
        ...option,
        label,
      };
    });
  }

  override get options(): Option[] {
    return this.#options;
  }

  override renderEntry(option: Option) {
    const isCurrentLanguage = option.value === this.lang;
    const exonym =
      isCurrentLanguage || ['both', 'exonym'].includes(this.format)
        ? html`<span class="clippy-lang-combobox__exonym">${option.exonym}</span>`
        : nothing;
    const autonym =
      !isCurrentLanguage && ['both', 'autonym'].includes(this.format)
        ? html`<span class="clippy-lang-combobox__autonym" lang=${option.value}>${option.autonym}</span>`
        : nothing;

    // Render separator only when both exonym and autonym will be rendered
    const separator =
      exonym === nothing || autonym === nothing ? nothing : html`<span role="presentation">${this.separator}</span>`;

    return html`<span class="clippy-lang-combobox__option">${exonym} ${separator} ${autonym}</span>`;
  }
}
