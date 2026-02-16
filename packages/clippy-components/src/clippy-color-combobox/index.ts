import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import { stringifyColor, type ColorValue } from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ClippyCombobox } from '../clippy-combobox';
import { allowedValuesConverter } from '../lib/converters';
import { safeCustomElement } from '../lib/decorators';
import LocalizationMixin from '../lib/LocalizationMixin';
import { type ColorName, type ColorNameTranslations } from './lib';
import messages from './messages/en';
import colorComboboxStyles from './styles';

type Option = {
  color?: Color;
  label: string;
  value: ColorValue | string;
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
  translations: Record<string, ColorName> = messages;
  #options: Option[] = [];

  static override readonly styles = [...ClippyCombobox.styles, colorComboboxStyles, unsafeCSS(colorSampleStyles)];

  override set lang(value: string) {
    this.loadLocalizations(value).then(() => {
      super.lang = value;
    });
  }

  async loadLocalizations(lang: string) {
    const SEPARATOR = '-';
    const subtags = lang.split(SEPARATOR);
    let translations: ColorNameTranslations | undefined;

    for (let i = subtags.length; i > 0; i--) {
      const code = subtags.slice(0, i).join(SEPARATOR);
      try {
        translations = await import(`./messages/${code}.ts`).then((module) => module.default);
        // Create a reverse lookup from translation to canonical color name for filtering
        const lookup = translations
          ? Object.fromEntries(Object.entries(translations).map(([k, v]) => [v, k] as [string, ColorName]))
          : undefined;
        this.translations = lookup || this.translations;
        this.lang = code;
        break;
      } catch {
        // ignore failure, continue with next
      }
    }
  }

  override readonly filter = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const queryColor = Color.try(this.translations[normalizedQuery] || normalizedQuery);
    return (option: Option) => {
      const label = option.label.toLowerCase();
      return Boolean(
        label.includes(normalizedQuery) || (queryColor && option.color && queryColor.deltaE(option.color, '2000') < 20),
      );
    };
  };

  @property({ type: Array })
  override get options(): Option[] {
    return this.#options;
  }

  override set options(value: Array<{ label: Option['label']; value: Option['value'] }>) {
    this.#options = value.map((option) => {
      const { label, value } = option;
      const color = new Color(typeof value === 'string' ? value : stringifyColor(value));
      return {
        color,
        label,
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
