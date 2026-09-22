import { css, unsafeCSS } from 'lit';

// Reflected onto the host by index.ts; exported so the CSS selector below can't drift from it.
export const focusVisibleAttribute = 'link-focus-visible';

export default css`
  :host {
    position: relative;
  }

  /* [1] this anchor is the actual focused element, so prevent browser-default outline */
  ::slotted([slot='link']) {
    cursor: pointer;
    inset-block: 0;
    inset-inline: 0;
    outline: none; /* [1] */
    overflow: clip;
    position: absolute;
    text-indent: 200%;
    white-space: nowrap;
  }

  :host(:hover) {
    background-color: var(--basis-color-default-bg-hover);
  }

  :host(:active) {
    background-color: var(--basis-color-default-bg-active);
  }

  /* [2] Prevent the outline being clipped when other cards/elements are rendered too close to this card */
  :host([${unsafeCSS(focusVisibleAttribute)}]) {
    background-color: var(--basis-focus-background-color);
    color: var(--basis-focus-color);
    outline-color: var(--basis-focus-outline-color);
    outline-offset: var(--basis-focus-outline-offset);
    outline-style: var(--basis-focus-outline-style);
    outline-width: var(--basis-focus-outline-width);
    z-index: 1; /* [2] */
  }

  /* VARIANTS */

  :host([variant='list-item']) {
    --clippy-card-footer-padding-inline-start: var(--basis-space-none);

    flex-direction: row;
    justify-content: space-between;
  }
`;
