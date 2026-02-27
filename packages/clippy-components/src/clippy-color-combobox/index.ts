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
import { BROAD_COLOR_NAMES, DELTA_E_THRESHOLD, type ColorName, type ColorNameTranslations } from './lib';
import messages from './messages/en';
import colorComboboxStyles from './styles';

type Option = {
  color?: Color | null;
  label: string;
  description?: string;
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
    this.loadLocalizations(value).then((code) => {
      super.lang = code;
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
        // Create a reverse lookup from translation to canonical color name for filtering.
        // This allows users to search for colors using localized names,
        // Translations are defined as { "red": "rood" } in Dutch, but we want to match the token with value "red" when searching for "rood".
        const lookup = translations
          ? Object.fromEntries(Object.entries(translations).map(([k, v]) => [v, k] as [string, ColorName]))
          : undefined;
        this.translations = lookup || this.translations;
        return code;
      } catch {
        // ignore failure, continue with next
      }
    }
    return lang;
  }

  override readonly filter = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const colorName = this.translations[normalizedQuery] || normalizedQuery;
    const queryColor = Color.try(colorName);
    return (option: Option) => {
      const label = option.label.toLowerCase();
      // Broader color names use a wider deltaE for matching, ie searching for "green" will match more colors than "pink".
      const maxDeltaE = BROAD_COLOR_NAMES.includes(colorName) ? DELTA_E_THRESHOLD * 2 : DELTA_E_THRESHOLD;
      return Boolean(
        label.includes(normalizedQuery) ||
        (queryColor && option.color && queryColor.deltaE(option.color, '2000') < maxDeltaE),
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
      const color = Color.try(typeof value === 'string' ? value : stringifyColor(value));
      return {
        color,
        label,
        value,
      };
    });
  }

  override getOptionForValue(value: Option['value'] | null): Option | undefined {
    if (value === null) return undefined;
    const option = super.getOptionForValue(value);
    if (!option) return undefined;
    const color = Color.try(typeof value === 'string' ? value : stringifyColor(value));
    return color ? { ...option, color } : undefined; // A color that cannot be parsed is not a valid option
  }

  override queryToValue(query: string): Option['value'] | null {
    if (this.allow === 'other') {
      const color = Color.try(this.translations[query.toLowerCase()] || query);
      return this.getOptionForValue(this.value)?.value || color === null
        ? query
        : color.toString({
            collapse: false,
            format: 'hex',
            inGamut: true,
          });
    }
    return super.queryToValue(query);
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
