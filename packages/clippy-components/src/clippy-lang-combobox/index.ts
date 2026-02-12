import { arrayFromTokenList } from '@src/lib/converters';
import { safeCustomElement } from '@src/lib/decorators';
import LocalizationMixin from '@src/lib/LocalizationMixin';
import { html } from 'lit';
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
    const formatArray = this.format.split('-') as ('autonym' | 'exonym')[];
    const classes = ['clippy-lang-combobox__option-label', 'clippy-lang-combobox__option-description'];

    // Only show the primary part in the input, show both in the list
    const parts = index === undefined ? [formatArray[0]] : formatArray;

    return html`${parts.map((part, i) => {
      const content = option[part];
      const optionDir = direction(option.value);
      let lang: string | undefined;
      let dir: typeof optionDir | undefined;
      if (part === 'autonym') {
        // If the autonym is in a different direction than the current language, use the autonym's language and direction for proper rendering
        lang = option.value;
        dir = optionDir === this.#dir ? undefined : optionDir;
      }
      return html`<div class="${classes[i]}" lang=${ifDefined(lang)} dir=${ifDefined(dir)}>${content}</div>`;
    })}`;
  }
}
