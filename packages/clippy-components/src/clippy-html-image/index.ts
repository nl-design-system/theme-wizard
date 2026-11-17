import { safeCustomElement } from '@lib/decorators';
import { isSlotEmpty } from '@src/lib/slot';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './styles';

let labelCounter = 0;

const tag = 'clippy-html-image';

/**
 * Wraps arbitrary HTML content and presents it to the accessibility tree as an image.
 *
 * @slot label - Accessible label content (rich HTML allowed). When provided, the figure gets
 *   `role="img"` and is labelled by the visually hidden figcaption.
 * @slot - Visual content — rendered with `inert` so it is skipped by assistive technology.
 */
@safeCustomElement(tag)
export class ClippyHtmlImage extends LitElement {
  static override readonly styles = [styles];

  @property({ type: Boolean })
  forcedColorAdjust = false;

  @state() private hasLabelSlot = false;

  private readonly labelId = `clippy-html-image-label-${++labelCounter}`;

  protected override firstUpdated() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');
    if (slot) {
      this.hasLabelSlot = !isSlotEmpty(slot);
    }
  }

  private readonly onLabelSlotChange = (event: Event) => {
    this.hasLabelSlot = !isSlotEmpty(event.target as HTMLSlotElement);
  };

  override render() {
    return html`
      <figure
        class="ma-html-image"
        role=${this.hasLabelSlot ? 'img' : nothing}
        aria-labelledby=${this.hasLabelSlot ? this.labelId : nothing}
      >
        <figcaption class="ma-html-image__label" hidden id=${this.labelId}>
          <slot name="label" @slotchange=${this.onLabelSlotChange}></slot>
        </figcaption>
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
