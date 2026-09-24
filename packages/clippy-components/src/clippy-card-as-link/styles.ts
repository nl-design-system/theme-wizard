import { css, unsafeCSS } from 'lit';

// Reflected onto the host by index.ts; exported so the CSS selector below can't drift from it.
export const focusVisibleAttribute = 'link-focus-visible';

export default css`
  :host {
    position: relative;
  }

  /*
   * [1] this anchor is the actual focused element, so prevent browser-default outline
   */
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
    background-color: var(--clippy-card-as-link-hover-background-color, var(--basis-color-default-bg-hover));
  }

  :host(:active) {
    background-color: var(--clippy-card-as-link-active-background-color, var(--basis-color-default-bg-active));
  }

  /*
   * [1] Make sure the focus outline follows the card's radius
   * [2] Prevent the outline being clipped when other cards/elements are rendered too close to this card
   */
  :host([${unsafeCSS(focusVisibleAttribute)}]) {
    background-color: var(--clippy-card-as-link-focus-background-color, var(--basis-focus-background-color));
    border-color: var(--clippy-card-as-link-focus-border-color, var(--basis-color-transparent));
    border-radius: var(--clippy-card-border-radius); /* [1] */
    color: var(--clippy-card-as-link-focus-color, var(--basis-focus-color));
    outline-color: var(--clippy-card-as-link-focus-outline-color, var(--basis-focus-outline-color));
    outline-offset: var(--clippy-card-as-link-focus-outline-offset, var(--basis-focus-outline-offset));
    outline-style: var(--clippy-card-as-link-focus-outline-style, var(--basis-focus-outline-style));
    outline-width: var(--clippy-card-as-link-focus-outline-width, var(--basis-focus-outline-width));
    z-index: 1; /* [2] */
  }

  /* VARIANTS */

  :host([variant='list-item']) {
    --clippy-card-footer-padding-inline-start: var(--basis-space-none);

    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`;
