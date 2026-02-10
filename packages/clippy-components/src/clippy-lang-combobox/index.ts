import { arrayFromTokenList } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import LocalizationMixin from '@src/lib/LocalizationMixin';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ClippyCombobox } from '../clippy-combobox';
import languages, { direction, type LangCode } from './languages';

type Option = {
  value: string;
  label: string;
  autonym: string;
  exonym: string;
};

const FORMAT_OPTIONS = ['autonym', 'exonym', 'autonym-exonym', 'exonym-autonym'] as const;
const DEFAULT_FORMAT_OPTION = FORMAT_OPTIONS[0];
type Format = (typeof FORMAT_OPTIONS)[number];

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
  exonyms = new Intl.DisplayNames(this.DEFAULT_LANG, { type: 'language' });
  @property({
    converter: {
      fromAttribute: (value: string | null): Format => FORMAT_OPTIONS.find((v) => v === value) || DEFAULT_FORMAT_OPTION,
    },
    type: String,
  })
  format: Format = DEFAULT_FORMAT_OPTION;
  #options: Option[] = [];
  #lang?: string;

  static readonly autonyms = { of: (code: string) => languages[code as LangCode] }; // static because not dependent on instance
  readonly autonyms = { of: ClippyLangCombobox.autonyms.of }; // consistent api with exonyms for convenience

  get #dir() {
    return direction(this.lang);
  }

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

  override readonly filter = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    return ({ autonym, exonym, label }: Option) => {
      const hasLabelMatch = label.toLowerCase().includes(normalizedQuery);
      switch (this.format) {
        case 'autonym':
          // When only displaying autonym, also check the exonym
          return hasLabelMatch || exonym.toLowerCase().includes(normalizedQuery);
        case 'exonym':
          // When only displaying exonym, also check the autonym
          return hasLabelMatch || autonym.toLowerCase().includes(normalizedQuery);
        default:
          return hasLabelMatch;
      }
    };
  };

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
      const label = this.format.startsWith('autonym') ? autonym : exonym;
      return {
        ...option,
        label,
      };
    });
  }

  override get options(): Option[] {
    return this.#options;
  }

  override renderEntry(option: Option, index?: number) {
    const optionDir = direction(option.value);
    const dir = optionDir === this.#dir ? undefined : optionDir;

    const formatArray = this.format.split('-') as ('autonym' | 'exonym')[];

    const exonym = formatArray.includes('exonym')
      ? html`<div class="clippy-lang-combobox__exonym">${option.exonym}</div>`
      : nothing;
    const autonym = formatArray.includes('autonym')
      ? html`<div class="clippy-lang-combobox__autonym" lang=${option.value} dir=${ifDefined(dir)}>
          ${option.autonym}
        </div>`
      : nothing;

    const templates = { autonym, exonym };
    // If `index` is undefined, it means we are rendering the selected value in the input,
    // so we only show the first part of the format (e.g. autonym if format is autonym-exonym).
    // If `index` is defined, we are rendering options in the listbox, so we show both autonym and exonym if specified.
    return html`${index === undefined ? templates[formatArray[0]] : formatArray.map((part) => templates[part])}`;
  }
}
