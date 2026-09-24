import { css, unsafeCSS } from 'lit';

// Reflected onto the host by index.ts; exported so the CSS selector below can't drift from it.
export const focusVisibleAttribute = 'link-focus-visible';

export default css`
  :host {
    /* HOVER */
    --_clippy-card-as-link-hover-background-color: var(
      --clippy-card-as-link-hover-background-color,
      var(--basis-color-default-bg-hover)
    );

    /* ACTIVE */
    --_clippy-card-as-link-active-background-color: var(
      --clippy-card-as-link-active-background-color,
      var(--basis-color-default-bg-active)
    );

    /* FOCUS */
    --_clippy-card-as-link-focus-background-color: var(
      --clippy-card-as-link-focus-background-color,
      var(--basis-focus-background-color)
    );
    --_clippy-card-as-link-focus-border-color: var(
      --clippy-card-as-link-focus-border-color,
      var(--basis-color-transparent)
    );
    --_clippy-card-as-link-focus-color: var(--clippy-card-as-link-focus-color, var(--basis-focus-color));
    --_clippy-card-as-link-focus-outline-color: var(
      --clippy-card-as-link-focus-outline-color,
      var(--basis-focus-outline-color)
    );
    --_clippy-card-as-link-focus-outline-offset: var(
      --clippy-card-as-link-focus-outline-offset,
      var(--basis-focus-outline-offset)
    );
    --_clippy-card-as-link-focus-outline-style: var(
      --clippy-card-as-link-focus-outline-style,
      var(--basis-focus-outline-style)
    );
    --_clippy-card-as-link-focus-outline-width: var(
      --clippy-card-as-link-focus-outline-width,
      var(--basis-focus-outline-width)
    );

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
    background-color: var(--_clippy-card-as-link-hover-background-color);
  }

  :host(:active) {
    background-color: var(--_clippy-card-as-link-active-background-color);
  }

  /*
   * [1] Make sure the focus outline follows the card's radius
   * [2] Prevent the outline being clipped when other cards/elements are rendered too close to this card
   */
  :host([${unsafeCSS(focusVisibleAttribute)}]) {
    background-color: var(--_clippy-card-as-link-focus-background-color);
    border-color: var(--_clippy-card-as-link-focus-border-color);
    border-radius: var(--_clippy-card-border-radius); /* [1] */
    color: var(--_clippy-card-as-link-focus-color);
    outline-color: var(--_clippy-card-as-link-focus-outline-color);
    outline-offset: var(--_clippy-card-as-link-focus-outline-offset);
    outline-style: var(--_clippy-card-as-link-focus-outline-style);
    outline-width: var(--_clippy-card-as-link-focus-outline-width);
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
