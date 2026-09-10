import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'clippy-color-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorSample;
  }
}

@safeCustomElement(tag)
export class ClippyColorSample extends LitElement {
  static override readonly styles = [unsafeCSS(colorSampleStyles), styles];

  @property() color: string = '';

  @property() label?: string = '';

  override render() {
    return html`
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        class="nl-color-sample"
        style="color: ${this.color};"
        width="16"
        height="16"
      >
        ${this.label ? html`<title>${this.label}</title>` : null}
        <rect width="100%" height="100%" fill="currentcolor" />
      </svg>
    `;
  }
}
