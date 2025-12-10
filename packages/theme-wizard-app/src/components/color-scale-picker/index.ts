import { EXTENSION_TOKEN_ID } from '@nl-design-system-community/css-scraper';
import { parseColor, type ColorSpace } from '@nl-design-system-community/design-tokens-schema';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ColorScale from '../../lib/ColorScale';
import ColorToken from '../../lib/ColorToken';
import styles from './styles';

// @TODO: get from design tokens schema
type ColorScaleObject = {
  [x: string]: ReturnType<ColorScale['toObject']>;
};

const DEFAULT_FROM = new ColorToken({
  $value: parseColor('black'),
});

const DEFAULT_NAME = 'zwart';

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
export class ColorScalePicker extends LitElement {
  @property() name = '';
  #from = DEFAULT_FROM;
  #scale = new ColorScale(DEFAULT_FROM);
  internals_ = this.attachInternals();
  #idName = 'color-scale-name';
  #idColor = 'color-scale-color';
  #name = '';
  #value: ColorScaleObject = {
    ['']: this.#scale.toObject(),
  };

  readonly supportsCSSColorValues = getSupportsCSSColorValues();

  static override readonly styles = [styles];
  static readonly formAssociated = true;

  @property()
  get value() {
    return this.#value;
  }

  set value(val: ColorScaleObject) {
    const oldValue = this.#value;
    this.#value = val;
    this.internals_.setFormValue(JSON.stringify(val));
    this.requestUpdate('value', oldValue);
  }

  @property()
  get from() {
    return this.#from;
  }

  set from(value: ColorToken) {
    this.#from = value;
    this.#scale.from = value;
  }

  get colorSpace(): ColorSpace {
    return this.from.$value.colorSpace;
  }

  get #nameInputValue(): string {
    const tokenId = this.#from.$extensions?.[EXTENSION_TOKEN_ID];
    const defaultName = tokenId ? `${tokenId}` : DEFAULT_NAME;
    return this.#name || defaultName;
  }

  override connectedCallback() {
    super.connectedCallback();
    const name = this.#nameInputValue;
    this.value = {
      [name]: this.#scale.toObject(),
    };
  }

  readonly handleColorChange = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.from = new ColorToken({
        $value: parseColor(event.target.value),
      });
      this.value = {
        [this.#name]: this.#scale.toObject(),
      };
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // readonly handleNameChange = (event: Event) => {
  //   if (event.target instanceof HTMLInputElement) {
  //     this.#name = event.target.value;
  //     this.value = {
  //       [this.#name]: this.#scale.toObject(),
  //     };
  //     this.dispatchEvent(new Event('change', { bubbles: true }));
  //   }
  // };

  // TODO: This component should trigger a change event with it's value and the subtree for all child color leafs
  // app.ts will then listen for the change (as it does now) and replace the subtree in Theme's updateAt()

  override render() {
    // TODO: allow `list` attribute for color suggestions
    return html`
      <div class="color-scale-picker">
        <!--<label for=${this.#idName}>Naam</label>
        <input id=${this.#idName} type="text" value=${this.#nameInputValue} @change=${this.handleNameChange} />-->
        <!--<label for=${this.#idColor}>Basiskleur</label>-->
        <input
          id=${this.#idColor}
          type="color"
          value=${this.supportsCSSColorValues ? this.from.toCSSColorFunction() : this.from.toHex()}
          colorSpace=${this.colorSpace}
          @input=${this.handleColorChange}
        />
        <output
          for=${this.#idColor}
          class="theme-color-scale__list"
          style=${`color: ${this.from?.toCSSColorFunction()}`}
        >
          ${this.#scale
            .list()
            .map(
              (stop) => html`
                <div
                  class="theme-color-scale__stop"
                  style=${`background-color: ${stop.toCSSColorFunction()}`}
                  title=${stop.$value.components.join(', ')}
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
