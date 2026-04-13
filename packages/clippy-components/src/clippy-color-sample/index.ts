import colorSampleStyles from '@nl-design-system-candidate/color-sample-css/color-sample.css?inline';
import { safeCustomElement } from '@src/lib/decorators';
import { LitElement, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

const tag = 'clippy-color-sample';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyColorSample;
  }
}

@safeCustomElement(tag)
export class ClippyColorSample extends LitElement {
  static override readonly styles = [unsafeCSS(colorSampleStyles)];

  @property() color: string = '';

  override render() {
    return html`
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        class="nl-color-sample"
        style="color: ${this.color};"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path d="M0 0H32V32H0Z" fill="currentcolor" />
      </svg>
    `;
  }
}
