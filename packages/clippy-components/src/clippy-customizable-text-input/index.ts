import { safeCustomElement } from '@src/lib/decorators';
import utrechtCustomizableTextInputStyles from '@utrecht/customizable-text-input-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import customizableTextInputStyles from './styles';

const tag = 'clippy-customizable-text-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCustomizableTextInput;
  }
}

@safeCustomElement(tag)
export class ClippyCustomizableTextInput extends LitElement {
  static override readonly styles = [
    unsafeCSS(utrechtCustomizableTextInputStyles),
    unsafeCSS(customizableTextInputStyles),
  ];

  override render() {
    return html`<span part="container" class="clippy-customizable-text-input | utrecht-customizable-text-input">
      <span class="utrecht-customizable-text-input__inner">
        <slot name="start"></slot>

        <span className="utrecht-customizable-text-input__wrap-input" part="wrap-input"><slot></slot></span>

        <slot name="end"></slot>
      </span>
    </span>`;
  }
}
