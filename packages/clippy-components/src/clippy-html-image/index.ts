import { safeCustomElement } from '@lib/decorators';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles';

let labelCounter = 0;

const tag = 'clippy-html-image';

@safeCustomElement(tag)
export class ClippyHtmlImage extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String })
  label?: string;

  @property({ type: Boolean })
  forcedColorAdjust = false;

  private readonly labelId = `clippy-html-image-label-${++labelCounter}`;

  override render() {
    return html`
      <figure
        class="ma-html-image"
        role=${this.label ? 'img' : nothing}
        aria-labelledby=${this.label ? this.labelId : nothing}
      >
        ${
          this.label
            ? html` <figcaption class="ma-html-image__label" hidden id=${this.labelId}>${this.label}</figcaption> `
            : nothing
        }
        <div
          class=${classMap({
            'ma-html-image__body': true,
            'ma-html-image__body--forced-color-adjust': this.forcedColorAdjust,
          })}
          inert="true"
          aria-hidden="true"
        >
          <slot></slot>
        </div>
      </figure>
    `;
  }
}
