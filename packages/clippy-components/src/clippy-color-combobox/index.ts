import { safeCustomElement } from '@lib/decorators';
import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import Color from 'colorjs.io';
import { html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import { namedColors, type ColorName } from './lib';
import messages from './messages/en';
import colorComboboxStyles from './styles';
import LocalizationMixin from '@src/lib/LocalizationMixin';

type Option = {
  color: Color;
  label: string;
  names: ColorName[];
  value: string;
};

const tag = 'clippy-color-combobox';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorCombobox;
  }
}

// Flatten the generic before applying the mixin to ensure type compatibility.
class C extends ClippyCombobox<Option> {}

@safeCustomElement(tag)
export class ClippyColorCombobox extends LocalizationMixin(C) {
  static override readonly styles = [...ClippyCombobox.styles, colorComboboxStyles, unsafeCSS(colorSampleStyles)];
  translations = messages;
  #options: Option[] = [];

  override set lang(value: string) {
    this.loadLocalizations(value).then(() => {
      super.lang = value;
    });
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
        this.lang = code;
        break;
      } catch {
        // ignore failure, continue with next
      }
    }
  }

  override readonly filter = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    return (option: Option) => {
      const label = option.label.toLowerCase();
      const names = option.names;
      return (
        label.includes(normalizedQuery) || names.some((name) => this.translations[name]?.includes(normalizedQuery))
      );
    };
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
