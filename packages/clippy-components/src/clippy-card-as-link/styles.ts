import { css, unsafeCSS } from 'lit';

// Reflected onto the host by index.ts; exported so the CSS selector below can't drift from it.
export const focusVisibleAttribute = 'link-focus-visible';

export default css`
  :host {
    position: relative;

    @media (forced-colors: active) {
      color: var(--_clippy-card-state-color, LinkText);
    }
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

  ::slotted([slot='header']) {
    text-decoration: var(--clippy-card-header-text-decoration, underline);

    @media (forced-colors: active) {
      --clippy-card-header-text-decoration: underline;
    }
  }

  :host(:hover) {
    --_clippy-card-state-color: var(--clippy-card-hover-color);
    --_clippy-card-forced-colors-color: LinkText;
    --clippy-card-background-color: var(--clippy-card-hover-background-color);
    --clippy-card-border-color: var(--clippy-card-hover-border-color);
  }

  :host(:active) {
    --_clippy-card-state-color: var(--clippy-card-active-color);
    --_clippy-card-forced-colors-color: LinkText;
    --clippy-card-background-color: var(--clippy-card-active-background-color);
    --clippy-card-border-color: var(--clippy-card-active-border-color);
  }

  /*
   * [1] Make sure the focus outline follows the card's radius
   * [2] Prevent the outline being clipped when other cards/elements are rendered too close to this card
   */
  :host([${unsafeCSS(focusVisibleAttribute)}]) {
    background-color: var(--clippy-card-focus-background-color, var(--basis-focus-background-color));
    border-color: var(--clippy-card-focus-border-color, var(--basis-color-transparent));
    border-radius: var(--clippy-card-border-radius); /* [1] */
    color: var(--clippy-card-focus-color, var(--basis-focus-color));
    outline-color: var(--clippy-card-focus-outline-color, var(--basis-focus-outline-color));
    outline-offset: var(--clippy-card-focus-outline-offset, var(--basis-focus-outline-offset));
    outline-style: var(--clippy-card-focus-outline-style, var(--basis-focus-outline-style));
    outline-width: var(--clippy-card-focus-outline-width, var(--basis-focus-outline-width));
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
