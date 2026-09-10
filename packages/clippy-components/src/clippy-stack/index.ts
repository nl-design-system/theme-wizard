import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';
import { type Sizes } from './types';

const tag = 'clippy-stack';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyStack;
  }
}

/**
 * Clippy Stack Component
 *
 * @slot - Default slot
 * @cssprop --clippy-stack-size - Size of the space between children
 */
@safeCustomElement(tag)
export class ClippyStack extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String }) size: Sizes = 'md';

  override render() {
    return html`<slot></slot>`;
  }
}
