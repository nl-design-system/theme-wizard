import type { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { consume } from '@lit/context';
import { legacyToModernColor, parseColor, type ColorSpace } from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { scrapedColorsContext } from '../../contexts/scraped-colors';
import ColorScale from '../../lib/ColorScale';
import ColorToken from '../../lib/ColorToken';
import { WizardTokenInput } from '../wizard-token-input';
import styles from './styles';

// @TODO: get from design tokens schema
type ColorScaleObject = {
  [x: string]: ReturnType<ColorScale['toObject']>;
};

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

@customElement('color-scale-picker')
export class ColorScalePicker extends WizardTokenInput {
  #from = DEFAULT_FROM;
  #scale = new ColorScale(DEFAULT_FROM);
  #idColor = 'color-scale-color';
  #value: ColorScaleObject = {
    ['']: this.#scale.toObject(),
  };

  readonly supportsCSSColorValues = getSupportsCSSColorValues();

  static override readonly styles = [styles];

  override get value(): ColorScaleObject {
    return this.#value;
  }

  override set value(val: ColorScaleObject) {
    const oldValue = this.#value;
    this.#value = val;
    this.internals_.setFormValue(JSON.stringify(val));
    this.requestUpdate('value', oldValue);
  }

  @property()
  colorValue?: string;

  @consume({ context: scrapedColorsContext, subscribe: true })
  @property({ attribute: false })
  scrapedColors: ScrapedColorToken[] = [];

  override willUpdate(changedProperties: Map<string, unknown>) {
    // Initialize from the colorValue attribute if changed (before render)
    if (changedProperties.has('colorValue') && this.colorValue) {
      try {
        this.#from = new ColorToken({
          $value: parseColor(this.colorValue),
        });
        this.#scale.from = this.#from;
        // Reset the internal value to match the new color
        this.#value = {
          [this.name]: this.#scale.toObject(),
        };
        this.internals_.setFormValue(JSON.stringify(this.#value));
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

  get from() {
    return this.#from;
  }

  get colorSpace(): ColorSpace {
    return this.from.$value.colorSpace;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value = {
      [this.name]: this.#scale.toObject(),
    };
  }

  readonly handleColorInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newToken = new ColorToken({
        $value: parseColor(event.target.value),
      });
      this.#from = newToken;
      this.#scale.from = newToken;
      this.requestUpdate();
    }
  };

  readonly handleColorChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newToken = new ColorToken({
        $value: parseColor(event.target.value),
      });
      this.#from = newToken;
      this.#scale.from = newToken;
      this.value = {
        [this.name]: this.#scale.toObject(),
      };
      this.requestUpdate();
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // TODO: This component should trigger a change event with it's value and the subtree for all child color leafs
  // app.ts will then listen for the change (as it does now) and replace the subtree in Theme's updateAt()

  override render() {
    // TODO: allow `list` attribute for color suggestions
    return html`
      <div class="color-scale-picker">
        <label for=${this.#idColor}>${this.label}</label>
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
          value=${this.supportsCSSColorValues ? this.from.toCSSColorFunction() : this.from.toHex()}
          colorSpace=${this.colorSpace}
          @input=${this.handleColorInput}
          @change=${this.handleColorChange}
          list="preset-colors"
        />
        <output
          for=${this.#idColor}
          class="theme-color-scale__list"
          style=${`color: ${this.from?.toCSSColorFunction()}`}
        >
          ${this.#scale
            .list()
            .map(
              (stop, index) => html`
                <div
                  class="theme-color-scale__stop"
                  style=${`background-color: ${stop.toCSSColorFunction()}`}
                  title=${`${index + 1}: ${stop.$value.components.join(', ')}`}
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
