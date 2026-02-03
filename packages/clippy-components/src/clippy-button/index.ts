import { safeCustomElement } from '@lib/decorators';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { html, unsafeCSS, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { allowedValuesConverter } from '../lib/converters';
import { FormElement } from '../lib/FormElement';
import buttonStyles from './styles';

const tag = 'clippy-button';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyButton;
  }
}

const allowedButtonTypes = ['button', 'submit', 'reset'] as const;
const allowedHints = ['positive', 'negative'] as const;
const allowedPurposes = ['primary', 'secondary', 'subtle'] as const;
const allowedSizes = ['small', 'medium'] as const;
type ButtonType = (typeof allowedButtonTypes)[number];
type Hint = (typeof allowedHints)[number];
type Purpose = (typeof allowedButtonTypes)[number];
type Size = (typeof allowedSizes)[number];
const defaultButtonType = 'button' satisfies ButtonType;
const defaultSize: Size = 'medium' satisfies Size;

@safeCustomElement(tag)
export class ClippyButton<T = unknown> extends FormElement<T> {
  @property({ type: Boolean }) 'icon-only' = false;
  @property({ type: Boolean }) toggle = false;
  @property({ type: Boolean }) pressed = false;
  @property({ type: Boolean }) busy = false;
  @property({
    converter: allowedValuesConverter(allowedHints),
    type: String,
  })
  hint?: Hint;
  @property({ converter: allowedValuesConverter(allowedSizes, defaultSize) })
  size: Size = defaultSize;
  @property({ converter: allowedValuesConverter(allowedPurposes) })
  purpose?: Purpose;
  @property({ converter: allowedValuesConverter(allowedButtonTypes, defaultButtonType) })
  type: ButtonType = defaultButtonType;

  static override readonly styles = [buttonStyles, unsafeCSS(buttonCss)];

  readonly #handleClick = () => {
    switch (this.type) {
      case 'reset':
        // Mimic button[type=reset] behavior
        return this.form?.reset();
      case 'submit':
        // Mimic button[type=submit] behavior
        return this.form?.dispatchEvent(new SubmitEvent('submit', { submitter: this }));
      default:
        return undefined;
    }
  };

  override render() {
    return html`
      <button
        @click=${this.#handleClick}
        type=${this.type}
        aria-pressed=${ifDefined(this.toggle && this.pressed)}
        aria-disabled=${ifDefined(this.disabled)}
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
