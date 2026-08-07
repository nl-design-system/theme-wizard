import paragraphStyles from '@nl-design-system-candidate/paragraph-css/paragraph.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import '../clippy-html-image';
import styles from './styles';

const tag = 'clippy-token-sample-text';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyTokenSampleText;
  }
}

/**
 * Clippy Token Sample Text Component
 *
 * @slot - Default slot
 *
 * @cssprop --clippy-token-sample-text-font-size - Font size
 * @cssprop --clippy-token-sample-text-font-family - Font family
 * @cssprop --clippy-token-sample-text-color - Color
 */
@safeCustomElement(tag)
export class ClippyTokenSampleText extends LitElement {
  static override readonly styles = [unsafeCSS(paragraphStyles), styles];

  @property({ attribute: 'font-size', type: String }) size: string = '';
  @property({ attribute: 'font-family', type: String }) family: string = '';
  @property({ type: String }) color: string = '';
  @property({ reflect: true, type: Boolean }) truncate: boolean = false;

  override willUpdate(changed: PropertyValues) {
    if (changed.has('size')) {
      this.style.setProperty('--_clippy-internal-token-sample-text-font-size', this.size);
    }
    if (changed.has('family')) {
      this.style.setProperty('--_clippy-internal-token-sample-text-font-family', this.family);
    }
    if (changed.has('color')) {
      this.style.setProperty('--_clippy-internal-token-sample-text-color', this.color);
    }
  }

  override render() {
    return html`
      <clippy-html-image>
        <p class="clippy-token-sample-text__dummy | nl-paragraph">
          <slot>Op brute wijze ving de schooljuf de quasi-kalme lynx.</slot>
        </p>
      </clippy-html-image>
    `;
  }
}
