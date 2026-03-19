import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-color-combobox';
import { ClippyColorCombobox } from '@nl-design-system-community/clippy-components/clippy-color-combobox';
import { EXTENSION_AUTHORED_AS } from '@nl-design-system-community/css-scraper';
import {
  COLOR_KEYS,
  ColorValue,
  ColorValueSchema,
  EXTENSION_RESOLVED_AS,
  parseColor,
  stringifyColor,
  type BaseDesignToken,
  type ColorSpace,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
import { dequal } from 'dequal';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type Theme from '../../lib/Theme';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import ColorScale from '../../lib/ColorScale';
import ColorToken from '../../lib/ColorToken';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils';
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
 * Extract the resolved color value from a token.
 * Relies on `EXTENSION_RESOLVED_AS` being populated by `resolveRefs`, which
 * Theme does on every token update.
 */
export const resolveColorValue = (token: ColorTokenType): ColorValue | undefined => {
  const value = token.$extensions?.[EXTENSION_RESOLVED_AS] ?? token.$value;
  const result = ColorValueSchema.safeParse(value);
  return result.success ? result.data : undefined;
};

export const EXTENSION_COLORSCALE_SEED = 'nl.nldesignsystem.theme-wizard.color-scale-seed-color';

const tag = 'wizard-colorscale-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardColorscaleInput;
  }
}

@customElement(tag)
export class WizardColorscaleInput extends WizardTokenInput {
  readonly #scale = new ColorScale(DEFAULT_FROM);
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

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme?: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  scrapedTokens: StagedDesignToken[] = [];

  @state()
  private currentColorValue: string = '';

  get #colorToken(): ColorTokenType | undefined {
    return this.theme?.at(`${this.name}.color-default`) as ColorTokenType | undefined;
  }

  get #seedColor(): ColorValue | undefined {
    const group = this.theme?.at(this.name) as BaseDesignToken | undefined;
    const seedColor = group?.$extensions?.[EXTENSION_COLORSCALE_SEED];
    if (seedColor && typeof seedColor === 'object' && 'colorSpace' in seedColor) {
      return seedColor as ColorValue;
    }
    return undefined;
  }

  get seedColor(): ColorValue {
    return this.#scale.from.$value;
  }

  #updateColorFromToken(colorToken: ColorTokenType | undefined) {
    if (!colorToken) return;
    try {
      const colorValue = resolveColorValue(colorToken);
      if (colorValue) {
        this.#scale.from = new ColorToken({ $value: colorValue });
        this.currentColorValue = stringifyColor(colorValue);
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
    if (changedProperties.has('theme') || changedProperties.has('name')) {
      const seedColor = this.#seedColor;
      if (seedColor) {
        this.#scale.from = new ColorToken({ $value: seedColor });
        this.currentColorValue = stringifyColor(seedColor);
      } else {
        this.#updateColorFromToken(this.#colorToken);
      }
      this.#updateScaleValue();
    }
  }

  get colorSpace(): ColorSpace {
    return this.#scale.from.$value.colorSpace;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.value = this.#scale.toObject();
    this.currentColorValue = stringifyColor(this.#scale.from.$value);
  }

  readonly handleColorChange = (event: Event) => {
    const target = event.target;
    if (target instanceof ClippyColorCombobox && target.value) {
      const value = typeof target.value === 'string' ? parseColor(target.value) : target.value;
      const newColorValue = stringifyColor(value);
      // Skip initialization-triggered events where the value hasn't actually changed
      if (newColorValue === this.currentColorValue) return;
      const newToken = new ColorToken({
        $value: value,
      });
      this.#scale.from = newToken;
      this.value = this.#scale.toObject();
      this.currentColorValue = newColorValue;
      if (!this.isConnected) return;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  };

  override render() {
    return html`
      <div class="wizard-colorscale-input">
        <clippy-color-combobox
          hidden-label=${this.label}
          name=${this.name}
          .options=${this.scrapedTokens
            .filter((token) => token.$type === 'color')
            .filter((token) => token.$extensions[EXTENSION_TOKEN_STAGED] !== false)
            .map((color) => ({
              /* Use the authored name if available for better UX, otherwise fall back to hex encoding */
              label: color.$extensions?.[EXTENSION_AUTHORED_AS] || stringifyColor(color.$value),
              value: color.$value,
            }))}
          .value=${this.currentColorValue}
          @change=${this.handleColorChange}
        >
        </clippy-color-combobox>
        <div
          role="presentation"
          class="wizard-colorscale-input__list"
          style=${`color: ${this.#scale.from?.toCSSColorFunction()}`}
        >
          ${this.#scale.list().map((stop, index) => {
            const cssColor = stop.toCSSColorFunction();
            return html`
              <div
                class="${classMap({
                  'wizard-colorscale-input__stop': true,
                  'wizard-colorscale-input__stop--seed': dequal(this.seedColor, stop.$value),
                })}"
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
