import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import styles from './styles';

let labelCounter = 0;

@customElement('clippy-html-image')
export class ClippyHtmlImage extends LitElement {
  static override readonly styles = [styles];

  @query('slot[name="label"]')
  private readonly labelSlot?: HTMLSlotElement;

  @query('[role="img"]')
  private readonly imgDiv?: HTMLDivElement;

  private readonly labelId = `clippy-html-image-label-${++labelCounter}`;
  private observer?: MutationObserver;

  override connectedCallback() {
    super.connectedCallback();
    // Watch for changes to light DOM
    this.observer = new MutationObserver(() => {
      this.updateLabelledBy();
    });
    this.observer.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  override updated() {
    this.updateLabelledBy();
    if (this.labelSlot) {
      this.labelSlot.addEventListener('slotchange', this.onLabelSlotChange);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.labelSlot?.removeEventListener('slotchange', this.onLabelSlotChange);
  }

  private readonly onLabelSlotChange = () => {
    this.updateLabelledBy();
  };

  private updateLabelledBy() {
    if (!this.labelSlot || !this.imgDiv) return;

    const nodes = this.labelSlot.assignedNodes({ flatten: true });
    const hasLabel = nodes.length > 0;

    if (hasLabel) {
      this.imgDiv.setAttribute('aria-labelledby', this.labelId);
    } else {
      this.imgDiv.removeAttribute('aria-labelledby');
    }
  }

  override render() {
    return html`<div role="img" inert>
        <slot></slot>
      </div>
      <slot id=${this.labelId} name="label" @slotchange=${this.onLabelSlotChange}></slot>`;
  }
}
