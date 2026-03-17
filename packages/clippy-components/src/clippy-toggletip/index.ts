import { safeCustomElement } from '@lib/decorators';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './../clippy-button';
import styles from './styles';

const tag = 'clippy-toggletip';

type Position = 'block-start' | 'inline-end' | 'block-end' | 'inline-start';

const validPositions = new Set<Position>(['block-start', 'inline-end', 'block-end', 'inline-start']);

const fromAttribute = (value: string | null): Position => {
  if (value === null) {
    return 'block-start';
  }

  if (validPositions.has(value as Position)) {
    return value as Position;
  }

  console.warn(`Invalid position "${value}". Using default "block-start".`);
  return 'block-start';
};

declare global {
  interface HTMLElementTagNameMap {
    [tag]: ClippyToggletip;
  }
}

@safeCustomElement(tag)
export class ClippyToggletip extends LitElement {
  @property({ type: String }) text = '';

  @property({
    converter: { fromAttribute },
    type: String,
  })
  position: Position = 'block-start';

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
