import { safeCustomElement } from '@src/lib/decorators';
import utrechtCustomizableTextInputSlotStyles from '@utrecht/customizable-text-input-css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import customizableTextInputStyles from './styles';

export const variants = ['action', 'label'] as const;
type Variant = (typeof variants)[number];
export const positions = ['start', 'end'] as const;
type Position = (typeof positions)[number];

const tag = 'clippy-customizable-text-input-slot';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyCustomizableTextInputSlot;
  }
}

@safeCustomElement(tag)
export class ClippyCustomizableTextInputSlot extends LitElement {
  static override readonly styles = [
    unsafeCSS(utrechtCustomizableTextInputSlotStyles),
    unsafeCSS(customizableTextInputStyles),
  ];

  @property() inputId: string = '';
  @property() variant: Variant = 'label';
  @property() position: Position = 'start';

  override render() {
    const classes = classMap({
      [`utrecht-customizable-text-input__slot--${this.position}`]: true,
      [`utrecht-customizable-text-input__slot--${this.variant}`]: true,
      'clippy-customizable-text-input-slot': true,
      'utrecht-customizable-text-input__slot': true,
    });
    return this.inputId
      ? html`<label for="${this.inputId}" class="${classes}"><slot></slot></label>`
      : html`<span class="${classes}"><slot></slot></span>`;
  }
}
