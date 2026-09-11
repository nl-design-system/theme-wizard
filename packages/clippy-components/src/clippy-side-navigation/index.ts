import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import styles from './styles';

const tag = 'clippy-side-navigation';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippySideNavigation;
  }
}

/**
 * Clippy Side Navigation Component
 *
 * @slot - Default slot
 */
@safeCustomElement(tag)
export class ClippySideNavigation extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`Hello world`;
  }
}
