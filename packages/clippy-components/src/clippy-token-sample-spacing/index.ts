import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import type { Concepts } from './types';
import styles from './styles';

const tag = 'clippy-token-sample-spacing';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleSpacing;
  }
}

/**
 * Clippy Token Sample Spacing Component
 *
 * @property {Concepts} concept - Spacing token concept
 * @property {string} size - Spacing token size
 * @cssprop [--clippy-token-sample-spacing-value] - Size of the spacing illustration
 */
@safeCustomElement(tag)
export class ClippyTokenSampleSpacing extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true })
  concept: Concepts = 'inline';

  @property({ type: String })
  size?: string = undefined;

  #renderLabel() {
    return html`<mark class="clippy-token-sample-spacing__label">Label</mark>`;
  }

  #renderIcon() {
    return html`<mark class="clippy-token-sample-spacing__icon">Icon</mark>`;
  }

  override willUpdate() {
    if (this.size) {
      this.style.setProperty('--clippy-token-sample-spacing-value', this.size);
      this.requestUpdate();
    }
  }

  override render() {
    return html`
      ${['text'].includes(this.concept) ? this.#renderIcon() : null} ${this.#renderLabel()}
      ${['row', 'column'].includes(this.concept) ? this.#renderLabel() : null}
    `;
  }
}
