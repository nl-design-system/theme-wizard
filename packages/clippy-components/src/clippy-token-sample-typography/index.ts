import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import '../clippy-html-image';
import styles from './styles';

const tag = 'clippy-token-sample-typography';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleTypography;
  }
}

/**
 * Clippy Token Sample Typography Component
 */
@safeCustomElement(tag)
export class ClippyTokenSampleTypography extends LitElement {
  static override readonly styles = [unsafeCSS(paragraphStyles), styles];

  @property({ type: String }) size: string = '';
  @property({ type: String }) family: string = '';
  @property({ type: String }) color: string = '';
  @property({ type: Boolean }) truncate: boolean = false;

  override render() {
    return html`
      <clippy-html-image>
        <p class="clippy-token-sample-typography__paragraph | nl-paragraph">
          <slot>Op brute wijze ving de schooljuf de quasi-kalme lynx.</slot>
        </p>
      </clippy-html-image>
    `;
  }
}
