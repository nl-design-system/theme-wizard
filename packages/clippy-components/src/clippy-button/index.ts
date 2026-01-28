import { safeCustomElement } from '@lib/decorators';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import buttonStyles from './styles';

const tag = 'clippy-button';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyButton;
  }
}

type Purpose = 'primary' | 'secondary' | 'subtle';
type Hint = 'positive' | 'negative';
type ButtonType = 'button' | 'submit' | 'reset';
type Size = 'small' | 'medium';
const defaultSize: Size = 'medium';

@safeCustomElement(tag)
export class ClippyButton extends LitElement {
  @property({ type: Boolean }) 'icon-only' = false;
  @property({ type: Boolean }) toggle = undefined;
  @property({ type: Boolean }) pressed = false;
  @property({ type: Boolean }) busy = false;
  @property({
    converter: {
      fromAttribute: (value: string | null): Hint | undefined => {
        if (value === 'positive' || value === 'negative') {
          return value;
        }
        console.warn(`Invalid hint "${value}".`);
        return undefined;
      },
    },
    type: String,
  })
  hint: Hint | undefined;
  @property({ type: Boolean }) disabled = false;
  @property({
    converter: {
      fromAttribute: (value: string | null): Size => {
        if (value === 'small' || value === 'medium') {
          return value;
        }
        console.warn(`Invalid size "${value}". Using default "medium".`);
        return 'medium';
      },
    },
    type: String,
  })
  size: Size = defaultSize;
  @property({
    converter: {
      fromAttribute: (value: string | null): Purpose | undefined => {
        if (value === 'primary' || value === 'secondary' || value === 'subtle') {
          return value;
        }
        console.warn(`Invalid purpose "${value}".`);
        return undefined;
      },
    },
    type: String,
  })
  purpose: Purpose | undefined;
  @property({
    converter: {
      fromAttribute: (value: string | null): ButtonType => {
        if (value === 'button' || value === 'submit' || value === 'reset') {
          return value;
        }
        console.warn(`Invalid button type "${value}". Using default "button".`);
        return 'button';
      },
    },
    type: String,
  })
  type: ButtonType = 'button';

  static override readonly styles = [buttonStyles, unsafeCSS(buttonCss)];

  override render() {
    return html`
      <button
        type=${this.type}
        aria-pressed=${this.toggle ? this.pressed : nothing}
        aria-disabled=${this.disabled || nothing}
        class=${classMap({
          [`clippy-button--${this.size}`]: this.size !== defaultSize,
          [`nl-button--${this.hint}`]: !!this.hint,
          [`nl-button--${this.purpose}`]: !!this.purpose,
          'nl-button': true,
          'nl-button--busy': this.busy,
          'nl-button--disabled': this.disabled,
          'nl-button--icon-only': this['icon-only'],
          'nl-button--pressed': this.toggle ? this.pressed : false,
        })}
      >
        <slot name="iconStart" class="nl-button__icon-start"></slot>
        <span class="nl-button__label"><slot></slot></span>
        <slot name="iconEnd" class="nl-button__icon-end"></slot>
      </button>
    `;
  }
}
