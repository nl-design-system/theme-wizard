import type { ScrapedColorToken } from '@nl-design-system-community/css-scraper';
import { consume } from '@lit/context';
import {
  COLOR_KEYS,
  ColorValue,
  EXTENSION_RESOLVED_AS,
  isRef,
  legacyToModernColor,
  parseColor,
  type ColorSpace,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
const transformScaleToColorKeys = (scaleObject: ColorScaleObject) => {
  return Object.fromEntries(COLOR_KEYS.map((key, index) => [key, scaleObject[String(index + 1)]]));
};

/**
 * Look up a token by its reference path
 */
const resolveTokenRef = (refString: string, allTokens: Record<string, unknown>): unknown => {
  const refPath = refString.replaceAll(/[{}]/g, '').split('.');
  let current: unknown = allTokens;
  for (const key of refPath) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
};

/**
 * Extract the resolved color value from a token
 */
export const resolveColorValue = (
  token: ColorTokenType,
  allTokens?: Record<string, unknown>,
): ColorValue | undefined => {
  // Guard against non-object tokens
  if (!token || typeof token !== 'object') {
    return undefined;
  }

  // Get the resolved color value from extensions or fallback to token's $value
  if (isRef(token['$value'])) {
    const resolved = token['$extensions']?.[EXTENSION_RESOLVED_AS];
    // If resolved value is an object with colorSpace, return it
    if (resolved && typeof resolved === 'object' && 'colorSpace' in resolved) {
      return resolved as ColorValue;
    }
    // If resolved value is a string ref and we have allTokens, recursively resolve it
    if (typeof resolved === 'string' && allTokens) {
      const refToken = resolveTokenRef(resolved, allTokens);
      if (refToken && typeof refToken === 'object') {
        return resolveColorValue(refToken as ColorTokenType, allTokens);
      }
    }
  }
  const value = token['$value'];
  if (value && typeof value === 'object' && 'colorSpace' in value) {
    return value as ColorValue;
  }
  return undefined;
};

@customElement('wizard-colorscale-input')
export class WizardColorscaleInput extends WizardTokenInput {
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
    let transformedVal: ColorScaleObject;
    const valObj = val;

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
      transformedVal = val;
    }
    this.#value = transformedVal;
    this.internals_.setFormValue(JSON.stringify(val));
    this.requestUpdate('value', oldValue);
  }

  @property({ attribute: false })
  colorToken?: ColorTokenType;

  @consume({ context: scrapedColorsContext, subscribe: true })
  @property({ attribute: false })
  scrapedColors: ScrapedColorToken[] = [];

  @property()
  inverse?: boolean;

  @state()
  private currentColorValue: string = '';

  #updateColorFromToken(colorToken: ColorTokenType | undefined) {
    if (!colorToken) return;
    try {
      const colorValue = resolveColorValue(colorToken);
      if (colorValue) {
        this.#scale.from = new ColorToken({ $value: colorValue });
        this.currentColorValue = legacyToModernColor.encode(colorValue);
      }
    } catch {
      // If parsing fails, keep the current scale
    }
  }

  #updateScaleValue() {
    this.#value = this.#scale.toObject();
    this.internals_.setFormValue(JSON.stringify(transformScaleToColorKeys(this.#value)));
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    // Ensure inverse is always set on the scale before any updates
    if (changedProperties.has('inverse') || changedProperties.has('colorToken')) {
      this.#scale.inverse = this.inverse;
    }

    // If the full value is being set, restore from it (takes precedence)
    if (changedProperties.has('value')) {
      this.#updateColorFromToken(this.colorToken);
      return;
    }

    // Initialize from the colorToken property if changed
    if (changedProperties.has('colorToken')) {
      this.#updateColorFromToken(this.colorToken);
      this.#updateScaleValue();
    }

    // Update internal value if inverse changed
    if (changedProperties.has('inverse')) {
      this.#updateScaleValue();
    }
  }

  get colorSpace(): ColorSpace {
    return this.#scale.from.$value.colorSpace;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value = this.#scale.toObject();
    this.currentColorValue = legacyToModernColor.encode(this.#scale.from.$value);
  }

  readonly handleColorChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const newToken = new ColorToken({
        $value: parseColor(event.target.value),
      });
      this.#scale.from = newToken;
      this.value = this.#scale.toObject();
      this.currentColorValue = event.target.value;
      this.requestUpdate();
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  override render() {
    return html`
      <div class="wizard-colorscale-input">
        <div class="wizard-colorscale-input__label">
          <label for=${this.#idColor}>${this.label}</label>
          <slot name="extra-label"></slot>
        </div>
        <div class="wizard-colorscale-input__input">
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
            .value=${this.currentColorValue}
            colorspace=${this.colorSpace}
            @change=${this.handleColorChange}
            list="preset-colors"
          />
        </div>
        <div
          role="presentation"
          class="wizard-colorscale-input__list"
          style=${`color: ${this.#scale.from?.toCSSColorFunction()}`}
        >
          ${this.#scale.list().map((stop, index) => {
            const cssColor = stop.toCSSColorFunction();
            return html`
              <div
                class="wizard-colorscale-input__stop"
                style=${`background-color: ${cssColor}`}
                title=${`${COLOR_KEYS.at(index)}: ${cssColor}`}
              ></div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wizard-colorscale-input': WizardColorscaleInput;
  }
}
