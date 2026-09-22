import { css } from 'lit';

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

  /* Reflected by index.ts, not selected via :focus-visible/:has() directly — see its comment.
     Declared last: same specificity as :host(:hover)/:host(:active) above, so on a tie (e.g. the
     pointer resting over an already-focused card) this must win, not lose silently to hover. */
  /* [2] Prevent the outline being clipped when other cards/elements are rendered too close to this card */
  :host([link-focus-visible]) {
    background-color: var(--basis-focus-background-color);
    color: var(--basis-focus-color);
    outline-color: var(--basis-focus-outline-color);
    outline-offset: var(--basis-focus-outline-offset);
    outline-style: var(--basis-focus-outline-style);
    outline-width: var(--basis-focus-outline-width);
    z-index: 1; /* [2] */
  }
`;
