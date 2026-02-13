import { safeCustomElement } from '@lib/decorators';
import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import LocalizationMixin from '@src/lib/LocalizationMixin';
import Color from 'colorjs.io';
import { html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import { allowedValuesConverter } from '../lib/converters';
import { namedColors, type ColorName } from './lib';
import messages from './messages/en';
import colorComboboxStyles from './styles';

type Option = {
  color: Color;
  label: string;
  names: ColorName[];
  value: string;
};

// There's no exhaustive list of fonts, so we allow values outside of supplied options.
const defaultAllowance = 'other';

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
  @property({ converter: allowedValuesConverter(ClippyCombobox.allowances, defaultAllowance) })
  override allow: (typeof ClippyCombobox.allowances)[number] = defaultAllowance;
  translations = messages;
  #options: Option[] = [];

  static override readonly styles = [...ClippyCombobox.styles, colorComboboxStyles, unsafeCSS(colorSampleStyles)];

  override set lang(value: string) {
    this.loadLocalizations(value).then((code) => {
      super.lang = code;
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
        return code;
      } catch {
        // ignore failure, continue with next
      }
    }
    return lang;
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

  override renderEntry(option: Option) {
    const color = option.color?.toString();
    return html`
      <span class="clippy-color-combobox__option">
        <svg
          role="img"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
          class="nl-color-sample"
          style=${styleMap({ color })}
        >
          <path d="M0 0H32V32H0Z" fill="currentcolor" />
        </svg>
        <span>${option.label}</span>
      </span>
    `;
  }
}
