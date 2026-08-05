import { safeCustomElement } from '@src/lib/decorators';
import CalendarIcon from '@tabler/icons/outline/calendar.svg?raw';
import { LitElement, PropertyValues, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
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

  #renderDummy({ icon, slotName }: { icon?: boolean; slotName: string }) {
    return html`<span class="clippy-token-sample-spacing__dummy">
      <slot name="${slotName}">${icon ? html`<clippy-icon>${unsafeSVG(CalendarIcon)}</clippy-icon>` : 'label'}</slot>
    </span>`;
  }

  override willUpdate(changed: PropertyValues) {
    if (changed.has('concept') && this.concept === undefined) {
      this.concept = 'inline';
    }
    if (changed.has('size') && this.size) {
      this.style.setProperty('--clippy-token-sample-spacing-size', this.size);
    }
  }

  override render() {
    return html`
      ${['row', 'column', 'text'].includes(this.concept) ? this.#renderDummy({ icon: this.concept === 'text', slotName: 'label-start' }) : nothing}
      ${this.#renderDummy({ slotName: 'label' })}
    `;
  }
}
