import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-page-header-compact';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPageHeaderCompact;
  }
}

/**
 * Clippy Side Navigation Component
 * @slot - Main content
 */
@safeCustomElement(tag)
export class ClippyPageHeaderCompact extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: Boolean })
  inverse: boolean = false;

  override render() {
    return html`<slot>Hello world</slot>`;
  }
}
