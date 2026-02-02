import { safeCustomElement } from '@lib/decorators';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { html, unsafeCSS, nothing, LitElement, PropertyValues } from 'lit';
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
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) busy = false;
  @property({ type: String }) expanded: boolean | string | undefined;
  @property({ type: String }) name?: string;
  @property({ type: String }) form?: string;
  @property({ type: String }) formaction?: string;
  @property({ type: String }) formenctype?: string;
  @property({ type: String }) formmethod?: string;
  @property({ type: Boolean }) formnovalidate = false;
  @property({ type: String }) formtarget?: string;
  @property({ type: String }) popovertarget?: string;
  @property({ type: String }) popovertargetaction?: string;
  @property({ type: String }) value?: string;

  @property({
    converter: {
      fromAttribute: (value: string | null): Hint | undefined => {
        if (value === 'positive' || value === 'negative') {
          return value;
        }
        if (value) console.warn(`Invalid hint "${value}".`);
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
        if (value === 'primary' || value === 'secondary' || value === 'subtle') {
          return value;
        }
        if (value) console.warn(`Invalid purpose "${value}".`);
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

  readonly #handleClick = () => {
    if (this.disabled) return;

    if (this.type === 'reset') {
      this.handleReset();
    } else if (this.type === 'submit') {
      this.handleSubmit();
    }
  };

  private handleReset() {
    const form = this.closest('form');
    if (form) {
      form.reset();
    }
  }

  private handleSubmit() {
    const form = this.closest('form');
    if (form) {
      form.requestSubmit();
    }
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('value')) {
      this.updateHiddenButton();
    }
  }

  private updateHiddenButton() {
    const needsHiddenButton = !!(
      this.name ||
      this.form ||
      this.formtarget ||
      this.formenctype ||
      this.formmethod ||
      this.formnovalidate ||
      this.popovertarget ||
      this.popovertargetaction ||
      this.type === 'submit'
    );

    let button = this.querySelector('button[hidden]') as HTMLButtonElement | null;

    if (button && !needsHiddenButton) {
      button.remove();
      return;
    }

    if (!button && needsHiddenButton) {
      button = this.ownerDocument.createElement('button');
      button.hidden = true;
      button.tabIndex = -1;
      button.setAttribute('aria-hidden', 'true');
      this.appendChild(button);
    }

    if (button) {
      const setAttribute = (name: string, value?: string | null) => {
        if (typeof value === 'string') {
          button.setAttribute(name, value);
        } else {
          button.removeAttribute(name);
        }
      };

      setAttribute('type', this.type);
      setAttribute('name', this.name);
      setAttribute('form', this.form);
      setAttribute('formaction', this.formaction);
      setAttribute('formenctype', this.formenctype);
      setAttribute('formmethod', this.formmethod);
      setAttribute('formnovalidate', this.formnovalidate ? '' : null);
      setAttribute('formtarget', this.formtarget);
      setAttribute('popovertarget', this.popovertarget);
      setAttribute('popovertargetaction', this.popovertargetaction);
      button.style.display = 'none';
      button.value = this.value || '';
    }
  }

  override render() {
    return html`
      <button
        aria-busy=${this.busy || nothing}
        aria-expanded=${typeof this.expanded === 'boolean' ? String(this.expanded) : this.expanded || nothing}
        aria-pressed=${this.toggle ? this.pressed : nothing}
        aria-disabled=${this.disabled || nothing}
        ?disabled=${this.disabled}
        @click=${this.#handleClick}
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
