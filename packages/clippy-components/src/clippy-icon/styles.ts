import { css } from 'lit';

export default css`
  :host {
    block-size: var(--clippy-icon-size);
    color: var(--clippy-icon-color);
    display: inline-block;
    font-size: var(--clippy-icon-size);
    inline-size: var(--clippy-icon-size);
    inset-block-start: var(--clippy-icon-inset-block-start, 0);
    position: relative;
  }

  ::slotted(svg) {
    block-size: 100%;
    inline-size: 100%;
    pointer-events: none;
  }
`;
