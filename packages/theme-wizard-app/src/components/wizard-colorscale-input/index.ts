import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-color-combobox';
import '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { ClippyTokenCombobox, type Option } from '@nl-design-system-community/clippy-components/clippy-token-combobox';
import { EXTENSION_AUTHORED_AS } from '@nl-design-system-community/css-scraper';
import {
  ColorValue,
  ColorValueSchema,
  EXTENSION_RESOLVED_AS,
  colorJSToColorValue,
  colorJSToHex,
  colorTokenValueToColorJS,
  parseColor,
  stringifyColor,
  type BaseDesignToken,
  type ColorSpace,
  type ColorToken as ColorTokenType,
} from '@nl-design-system-community/design-tokens-schema';
import Color from 'colorjs.io';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type Theme from '../../lib/Theme';
import { scrapedTokensContext } from '../../contexts/scraped-tokens';
import { themeContext } from '../../contexts/theme';
import { generateScale, type ProfileName } from '../../lib/color-scale-generator';
import { EXTENSION_TOKEN_STAGED, StagedDesignToken } from '../../utils';
import { WizardTokenInput } from '../wizard-token-input';
import styles from './styles';

type ColorScaleObject = Record<string, ColorTokenType>;

const DEFAULT_SEED: ColorValue = parseColor('black');

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

// The color scale generator works off a structural profile (masks extracted from the
// NL Design System theme), not the group name — several group names in BASIS_COLOR_NAMES
// alias to the same 'accent' shape, per the generator's README.
const PROFILE_BY_COLOR_KEY: Record<string, ProfileName> = {
  'accent-1': 'accent',
  'accent-2': 'accent',
  'accent-3': 'accent',
  'action-1': 'accent',
  'action-2': 'accent',
  default: 'neutral',
  disabled: 'disabled',
  highlight: 'highlight',
  info: 'accent',
  negative: 'negative',
  positive: 'positive',
  selected: 'accent',
  warning: 'warning',
};

const profileForName = (name: string): ProfileName => {
  const colorKey = name.split('.').at(-1) ?? '';
  return PROFILE_BY_COLOR_KEY[colorKey] ?? 'accent';
};

const toColorScaleObject = (scale: Record<string, string>): ColorScaleObject =>
  Object.fromEntries(
    Object.entries(scale).map(([key, hex]) => [key, { $type: 'color', $value: parseColor(hex) } as ColorTokenType]),
  );

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
  #seed: ColorValue = DEFAULT_SEED;

  #options: Option[] = [];

  readonly supportsCSSColorValues = getSupportsCSSColorValues();

  static override readonly styles = [styles];

  get #profile(): ProfileName {
    return profileForName(this.name);
  }

  get #regularScale(): Record<string, string> {
    return generateScale(this.currentColorValue, { anchor: 'auto', profile: this.#profile }).data;
  }

  get #inverseScale(): Record<string, string> {
    return generateScale(this.currentColorValue, { anchor: 'auto', inverse: true, profile: this.#profile }).data;
  }

  override get value(): ColorScaleObject {
    return toColorScaleObject(this.#regularScale);
  }

  override set value(val) {
    const oldValue = this.value;
    if (val && typeof val === 'object' && 'color-default' in val) {
      const baseColorToken = (val as ColorScaleObject)['color-default'];
      if (baseColorToken && typeof baseColorToken === 'object' && '$value' in baseColorToken) {
        const colorValue = baseColorToken.$value;
        if (colorValue && typeof colorValue === 'object') {
          this.#seed = colorValue as ColorValue;
          this.currentColorValue = stringifyColor(colorValue);
        }
      }
    }
    this.internals_.setFormValue(JSON.stringify(this.value));
    this.requestUpdate('value', oldValue);
  }

  /** The scale's dark-mode counterpart, e.g. for a `${name}-inverse` token group. */
  get inverseValue(): ColorScaleObject {
    return toColorScaleObject(this.#inverseScale);
  }

  @consume({ context: themeContext, subscribe: true })
  @state()
  private readonly theme?: Theme;

  @consume({ context: scrapedTokensContext, subscribe: true })
  @property({ attribute: false })
  scrapedTokens: StagedDesignToken[] = [];

  @state()
  private currentColorValue: string = stringifyColor(DEFAULT_SEED);

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
    return this.#seed;
  }

  #updateColorFromToken(colorToken: ColorTokenType | undefined) {
    if (!colorToken) return;
    try {
      const colorValue = resolveColorValue(colorToken);
      if (colorValue) {
        this.#seed = colorValue;
        this.currentColorValue = stringifyColor(colorValue);
      }
    } catch {
      // If parsing fails, keep the current scale
    }
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('theme') || changedProperties.has('name')) {
      const seedColor = this.#seedColor;
      if (seedColor) {
        this.#seed = seedColor;
        this.currentColorValue = stringifyColor(seedColor);
      } else {
        this.#updateColorFromToken(this.#colorToken);
      }
      this.internals_.setFormValue(JSON.stringify(this.value));
    }
  }

  get colorSpace(): ColorSpace {
    return this.#seed.colorSpace;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.currentColorValue = stringifyColor(this.#seed);
    this.internals_.setFormValue(JSON.stringify(this.value));

    this.#options = this.scrapedTokens.reduce((acc, token) => {
      if (token.$type === 'color' && token.$extensions[EXTENSION_TOKEN_STAGED] !== false) {
        acc.push({
          label: token.$extensions?.[EXTENSION_AUTHORED_AS] || stringifyColor(token.$value),
          value: token,
        });
      }
      return acc;
    }, [] as Option[]);
  }

  readonly handleColorChange = (event: Event) => {
    const target = event.target;
    if (target instanceof ClippyTokenCombobox && target.value) {
      const rawValue = target.value;
      let color: Color;
      let value: ColorValue;
      if (typeof rawValue === 'string') {
        color = new Color(rawValue);
        value = colorJSToColorValue(color);
      } else {
        color = colorTokenValueToColorJS(rawValue.$value);
        value = rawValue.$value;
      }
      const newColorValue: string = colorJSToHex(color);
      // Skip initialization-triggered events where the value hasn't actually changed
      if (newColorValue === this.currentColorValue) return;
      this.#seed = value;
      this.currentColorValue = newColorValue;
      this.internals_.setFormValue(JSON.stringify(this.value));
      if (!this.isConnected) return;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  };

  override render() {
    const resolvedValueToken: ColorTokenType = { $type: 'color', $value: parseColor(this.currentColorValue) };
    const seedHex = this.currentColorValue.toUpperCase();

    return html`
      <div class="wizard-colorscale-input">
        <clippy-token-combobox
          type="color"
          hidden-label=${this.label}
          name=${this.name}
          .options=${this.#options}
          .value=${resolvedValueToken}
          @change=${this.handleColorChange}
        >
        </clippy-token-combobox>
        <div role="presentation" class="wizard-colorscale-input__list">
          ${Object.entries(this.#regularScale).map(([key, hex]) => {
            return html`
              <div
                class="${classMap({
                  'wizard-colorscale-input__stop': true,
                  'wizard-colorscale-input__stop--seed': hex === seedHex,
                })}"
                style=${`background-color: ${hex}`}
                title=${`${key}: ${hex}`}
                data-testid="color-scale-stop"
                data-value=${hex}
              ></div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
