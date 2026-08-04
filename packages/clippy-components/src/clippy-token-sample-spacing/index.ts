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

@safeCustomElement(tag)
export class ClippyTokenSampleSpacing extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true })
  concept: Concepts = 'inline';

  override render() {
    return html`<span>clippy-token-sample-spacing</span>`;
  }
}
