import { safeCustomElement } from '@lib/decorators';
import { LitElement, html } from 'lit';
import iconStyles from './styles';

const tag = 'clippy-icon';

/**
 * Clippy Icon Component
 *
 * A decorative icon wrapper component following NL Design System patterns.
 * Implements WCAG 2.2 compliance by marking decorative icons as aria-hidden.
 *
 * @slot - Default slot for SVG icon content
 *
 * @cssprop --clippy-icon-size - Size of the icon (width and height)
 * @cssprop --clippy-icon-color - Color of the icon
 * @cssprop --clippy-icon-inset-block-start - Vertical offset from baseline
 */
@safeCustomElement(tag)
export class ClippyIcon extends LitElement {
  static override readonly styles = [iconStyles];

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Ensure decorative icons are hidden from assistive technology
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyIcon;
  }
}
