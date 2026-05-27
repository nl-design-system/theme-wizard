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
    return html`<slot></slot>`;
  }
}
