import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeCustomElement } from '@lib/decorators';
import styles from './styles';

const tag = 'clippy-popover';

let instanceCount = 0;

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyPopover;
  }
}

/**
 * A generic disclosure: a trigger button that toggles an anchored panel via the
 * native Popover API. All visible/accessible text — trigger icon, accessible
 * name, panel content — is supplied by the caller; this component holds none
 * of its own.
 */
@safeCustomElement(tag)
export class ClippyPopover extends LitElement {
  static override readonly styles = [styles];

  /** Accessible name for the trigger button. Required for icon-only triggers. */
  @property({ attribute: 'trigger-label', type: String }) triggerLabel = '';

  readonly #instanceId = ++instanceCount;
  readonly #panelId = `clippy-popover-panel-${this.#instanceId}`;
  readonly #anchorName = `--clippy-popover-anchor-${this.#instanceId}`;

  override render() {
    return html`
      <button
        type="button"
        class="clippy-popover__trigger"
        popovertarget=${this.#panelId}
        aria-label=${this.triggerLabel || nothing}
        style="anchor-name: ${this.#anchorName}"
      >
        <slot name="trigger"></slot>
      </button>
      <div
        id=${this.#panelId}
        class="clippy-popover__panel"
        popover="auto"
        style="position-anchor: ${this.#anchorName}"
      >
        <slot></slot>
      </div>
    `;
  }
}
