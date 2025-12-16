import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import Color from 'colorjs.io';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import { namedColors, type ColorName } from './lib';
import messages from './messages/en';
import colorComboboxStyles from './styles';

type Option = {
  color: Color;
  label: string;
  names: ColorName[];
  value: string;
};

const tag = 'clippy-color-combobox';

const DEFAULT_LANG = 'en';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorCombobox;
  }
}

@customElement(tag)
export class ClippyColorCombobox extends ClippyCombobox<Option> {
  static override readonly styles = [...ClippyCombobox.styles, colorComboboxStyles, unsafeCSS(colorSampleStyles)];
  translations = messages;

  #options: Option[] = [];

  #lang?: string;

  @property()
  override get lang() {
    return this.#lang || DEFAULT_LANG;
  }

  override set lang(value: string) {
    this.loadLocalizations(value);
  }

  async loadLocalizations(lang: string) {
    const SEPARATOR = '-';
    const subtags = lang.split(SEPARATOR);
    let translations;

    for (let i = subtags.length; i > 0; i--) {
      const code = subtags.slice(0, i).join(SEPARATOR);
      try {
        translations = await import(`./messages/${code}.ts`).then((module) => module.default);
        this.translations = translations || this.translations;
        this.#lang = code;
        break;
      } catch {
        // ignore failure, continue with next
      }
    }
  }

  override readonly filter = (option: Option) => {
    const query = this.query.toLowerCase();
    const label = `${option.label}`.toLowerCase();
    const names = option.names;
    return label.includes(query) || names.some((name) => this.translations[name]?.includes(query));
  };

  @property({ type: Array })
  override get options(): Option[] {
    return this.#options;
  }

  override set options(value: Array<{ label: Option['label']; value: Option['value'] }>) {
    this.#options = value.map(({ label, value }) => {
      const color = new Color(value);
      const names = namedColors
        .filter(({ hue, rgb }) => (color.h ? hue(color.h) : rgb([color.r || 0, color.g || 0, color.b || 0])))
        .map(({ name }) => name);
      return {
        color,
        label,
        names,
        value,
      };
    });
  }

  override valueToQuery(value: Option['value']): string {
    return Array.isArray(value) ? value[0] : value.split(',')[0];
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
    this.lang = lang || DEFAULT_LANG;
  }

  override renderEntry(option: Option) {
    const color = option.color?.toString();
    return html`
      <span class="clippy-color-combobox__option">
        <svg role="img" xmlns="http://www.w3.org/2000/svg" class="nl-color-sample" style=${styleMap({ color })}>
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
        <span>${option.label}</span>
      </span>
    `;
  }
}
