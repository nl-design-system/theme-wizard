import { safeCustomElement } from '@lib/decorators';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { html, unsafeCSS, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { FormElement } from './../lib/FormElement';
import buttonStyles from './styles';

const tag = 'clippy-button';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyButton;
  }
}

type Purpose = 'primary' | 'secondary' | 'subtle' | 'subtle-inverse';
type Hint = 'positive' | 'negative';
type ButtonType = 'button' | 'submit' | 'reset';
type Size = 'small' | 'medium';
const defaultSize: Size = 'medium';

@safeCustomElement(tag)
export class ClippyButton<T = unknown> extends FormElement<T> {
  @property({ attribute: 'icon-only', type: Boolean }) iconOnly = false;
  @property({ type: Boolean }) toggle = undefined;
  @property({ type: Boolean }) pressed = false;
  @property({ type: Boolean }) busy = false;
  @property({ type: Boolean }) expanded: boolean = false;
  @property({ type: String }) controls: string | undefined = undefined;
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
        if (value === 'primary' || value === 'secondary' || value === 'subtle' || value === 'subtle-inverse') {
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

  static override readonly styles = [unsafeCSS(buttonCss), buttonStyles];

  override render() {
    return html`
      <button
        type=${this.type}
        aria-pressed=${this.toggle ? this.pressed : nothing}
        aria-disabled=${this.disabled || nothing}
        aria-expanded=${this.expanded || nothing}
        aria-controls=${this.controls || nothing}
        class=${classMap({
          [`clippy-button--${this.size}`]: this.size !== defaultSize,
          [`nl-button--${this.hint}`]: !!this.hint,
          // if the purpose is not subtle-inverse apply the purpose
          [`nl-button--${this.purpose}`]: Boolean(this.purpose) && this.purpose !== 'subtle-inverse',
          'nl-button': true,
          'nl-button--busy': this.busy,
          'nl-button--disabled': this.disabled,
          'nl-button--icon-only': this.iconOnly,
          'nl-button--pressed': this.toggle ? this.pressed : false,
          // if the purpose is subtle-inverse, we also want the subtle purpose class applied
          'nl-button--subtle nl-button--subtle-inverse': !!this.purpose && this.purpose === 'subtle-inverse',
        })}
      >
        <slot name="iconStart" class="nl-button__icon-start"></slot>
        <span class="nl-button__label"><slot></slot></span>
        <slot name="iconEnd" class="nl-button__icon-end"></slot>
      </button>
    `;
  }
}
