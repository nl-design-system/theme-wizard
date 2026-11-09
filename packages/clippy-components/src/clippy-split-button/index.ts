import { safeCustomElement } from '@src/lib/decorators';
import { html, LitElement } from 'lit';
import styles from './styles';

const tag = 'clippy-split-button';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippySplitButton;
  }
}

/**
 * Clippy Split Button Component
 *
 * Joins a button at the start and a button at the end, which opens a menu or is a second action, into one control.
 *
 * @slot start - The main action.
 * @slot end - The button at the end, an icon-only `clippy-button` that opens a menu or a second action.
 * @slot menu - Optional menu the end button opens, typically a `<ul role="menu">`.
 *
 * @cssprop --clippy-split-button-divider-color - Line between a `purpose="primary"` start button and the end one.
 * @cssprop --clippy-split-button-divider-width - Width of that line.
 * @cssprop --clippy-split-button-menu-background-color - Background of the menu.
 * @cssprop --clippy-split-button-menu-border-color - Border color of the menu.
 * @cssprop --clippy-split-button-menu-border-radius - Corners of the menu.
 * @cssprop --clippy-split-button-menu-border-width - Border width of the menu.
 * @cssprop --clippy-split-button-menu-box-shadow - Shadow of the menu.
 * @cssprop --clippy-split-button-menu-item-border-radius - Corners of the menu items, square by default.
 */
@safeCustomElement(tag)
export class ClippySplitButton extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`<slot name="start"></slot><slot name="end"></slot><slot name="menu"></slot>`;
  }
}
