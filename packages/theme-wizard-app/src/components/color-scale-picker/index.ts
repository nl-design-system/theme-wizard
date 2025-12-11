import type { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { consume } from '@lit/context';
import {
  COLOR_KEYS,
  legacyToModernColor,
  parseColor,
  type ColorSpace,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scrapedColorsContext } from '../../contexts/scraped-colors';
import ColorScale from '../../lib/ColorScale';
import ColorToken from '../../lib/ColorToken';
import { WizardTokenInput } from '../wizard-token-input';
import styles from './styles';

type ColorScaleObject = Record<string, ColorTokenType>;

const DEFAULT_FROM = new ColorToken({
  $value: parseColor('black'),
});

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color
 * @returns boolean
 */
const getSupportsCSSColorValues = () => {
  const el = document.createElement('input');
  el.type = 'color';
  el.value = 'hsl(0 100% 50%)';
  const hasSupport = el.value !== '#000000';
  el.remove();
  return hasSupport;
};

/**
 * Transform ColorScale output (numeric keys "1"-"14") to COLOR_KEYS format
 */
const transformScaleToColorKeys = (scaleObject: Record<string, ColorTokenType>) => {
  return Object.fromEntries(COLOR_KEYS.map((key, index) => [key, scaleObject[String(index + 1)]]));
};

@customElement('color-scale-picker')
export class ColorScalePicker extends WizardTokenInput {
  readonly #scale = new ColorScale(DEFAULT_FROM);
  readonly #idColor = 'color-scale-color';
  #value = this.#scale.toObject();

  readonly supportsCSSColorValues = getSupportsCSSColorValues();

  static override readonly styles = [styles];

  override get value(): ColorScaleObject {
    return transformScaleToColorKeys(this.#value);
  }

  override set value(val) {
    const oldValue = this.#value;
    // Store the transformed value (with COLOR_KEYS)
    let transformedVal: Record<string, ColorTokenType>;
    const valObj = val as Record<string, ColorTokenType>;

    // Check if this looks like a COLOR_KEYS formatted object (has color-default key)
    if (typeof val === 'object' && val !== null && 'color-default' in valObj) {
      transformedVal = Object.fromEntries(COLOR_KEYS.map((key, index) => [String(index + 1), valObj[key]])) as Record<
        string,
        ColorTokenType
      >;
      // When restoring from persisted data, extract the base color to update the input
      const baseColorToken = valObj['color-default'];
      if (baseColorToken && typeof baseColorToken === 'object' && '$value' in baseColorToken) {
        const colorValue = baseColorToken.$value;
        if (colorValue && typeof colorValue === 'object') {
          this.#scale.from = new ColorToken({ $value: colorValue });
        }
      }
    } else {
      transformedVal = val as Record<string, ColorTokenType>;
    }
    this.#value = transformedVal;
    this.internals_.setFormValue(JSON.stringify(val));
    this.requestUpdate('value', oldValue);
  }

  @property()
  colorValue?: string;

  @consume({ context: scrapedColorsContext, subscribe: true })
  @property({ attribute: false })
  scrapedColors: ScrapedColorToken[] = [];

  override willUpdate(changedProperties: Map<string, unknown>) {
    // If the full value is being set, restore from it (takes precedence)
    if (changedProperties.has('value')) {
      // The value setter will handle updating #value
      // But we need to also update #scale.from from colorValue if it's available
      if (this.colorValue) {
        try {
          this.#scale.from = new ColorToken({
            $value: parseColor(this.colorValue),
          });
        } catch {
          // If parsing fails, keep the current scale
        }
      }
      return;
    }

    // Initialize from the colorValue attribute if changed (before render)
    if (changedProperties.has('colorValue') && this.colorValue) {
      try {
        this.#scale.from = new ColorToken({
          $value: parseColor(this.colorValue),
        });
        // Reset the internal value to match the new color
        this.#value = this.#scale.toObject();
        // Set form value using COLOR_KEYS format for consistency
        this.internals_.setFormValue(JSON.stringify(transformScaleToColorKeys(this.#value)));
      } catch {
        // If parsing fails, keep the default
      }
    }
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    // Update the input element's value after render
    if (changedProperties.has('colorValue')) {
      const input = this.shadowRoot?.querySelector('input[type="color"]') as HTMLInputElement;
      if (input && this.colorValue) {
        input.value = this.colorValue;
      }
    }
  }

  get colorSpace(): ColorSpace {
    return this.#scale.from.$value.colorSpace;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value = this.#scale.toObject();
  }

  readonly handleColorChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newToken = new ColorToken({
        $value: parseColor(event.target.value),
      });
      this.#scale.from = newToken;
      this.value = this.#scale.toObject();
      this.requestUpdate();
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  override render() {
    return html`
      <div class="color-scale-picker">
        <div class="label">
          <label for=${this.#idColor}>${this.label}</label>
          <slot name="extra-label"></slot>
        </div>
        ${this.scrapedColors.length === 0
          ? nothing
          : html`<datalist id="preset-colors">
              ${this.scrapedColors.map(
                (color: ScrapedColorToken) => html`<option>${legacyToModernColor.encode(color.$value)}</option>`,
              )}
            </datalist>`}
        <input
          id=${this.#idColor}
          name=${this.#idColor}
          type="color"
          value=${this.colorValue}
          colorSpace=${this.colorSpace}
          @change=${this.handleColorChange}
          list="preset-colors"
        />
        <output
          for=${this.#idColor}
          class="theme-color-scale__list"
          style=${`color: ${this.#scale.from?.toCSSColorFunction()}`}
        >
          ${this.#scale
            .list()
            .map(
              (stop, index) => html`
                <div
                  class="theme-color-scale__stop"
                  style=${`background-color: ${stop.toCSSColorFunction()}`}
                  title=${`${COLOR_KEYS.at(index)}: ${stop.$value.components.join(', ')}`}
                ></div>
              `,
            )}
        </output>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-scale-picker': ColorScalePicker;
  }
}
