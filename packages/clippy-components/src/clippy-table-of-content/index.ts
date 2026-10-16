import { type NavigationItems } from '@src/clippy-navigation-bar';
import '@src/clippy-heading';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import srOnly from '../lib/sr-only';
import styles from './styles';

const tag = 'clippy-table-of-content';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTableOfContent;
  }
}

/**
 * Clippy Side Navigation Component
 */
@safeCustomElement(tag)
export class ClippyTableOfContent extends LitElement {
  static override readonly styles = [styles, srOnly];

  @property({ type: Object })
  items?: NavigationItems;

  @property({ type: String }) label: string = 'Inhoudsopgave';

  readonly #navId = crypto.randomUUID();

  override render() {
    return html`
      <nav class="clippy-table-of-content" aria-labelledby=${this.#navId}>
        <clippy-heading level=${2} id=${this.#navId}>${this.label}</clippy-heading>
        <mark>Hello world</mark>
      </nav>
    `;
  }
}
