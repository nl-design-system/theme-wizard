import { safeCustomElement } from '@lib/decorators';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './../clippy-button';
import styles from './styles';

const tag = 'clippy-toggletip';

type Position = 'top' | 'right' | 'bottom' | 'left';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyToggletip;
  }
}

@safeCustomElement(tag)
export class ClippyToggletip extends LitElement {
  @property({ type: String }) text = '';

  @property({
    converter: {
      fromAttribute: (value: string | null): Position => {
        if (value === 'top' || value === 'right' || value === 'bottom' || value === 'left') {
          return value;
        }
        if (value !== null) {
          console.warn(`Invalid position "${value}". Using default "top".`);
        }
        return 'top';
      },
    },
    type: String,
  })
  position: Position = 'top';

  static override readonly styles = [styles];

  override render() {
    return html`
      <span class=${classMap({ [`clippy-toggletip--${this.position}`]: true, 'clippy-toggletip': true })}>
        <span class="clippy-toggletip__trigger">
          <slot></slot>
        </span>
        <span class="clippy-toggletip__popup" role="tooltip"> ${this.text || nothing} </span>
      </span>
    `;
  }
}
