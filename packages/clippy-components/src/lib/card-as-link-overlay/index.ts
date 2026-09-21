import { css } from 'lit';

/**
 * Shared by the `clippy-card-as-link-*` components: makes the host a single clickable link via
 * a real `<a>` slotted as a direct child (in any slot). A `::slotted(a)::after` overlay
 * stretches that anchor's clickable/hoverable/focusable area to cover the whole host — pure
 * CSS, no JavaScript. `:host` must not set its own `position` (this establishes `relative`).
 */
export default css`
  :host {
    position: relative;
  }

  ::slotted(a:first-of-type) {
    color: inherit;
    text-decoration: none;
  }

  ::slotted(a:first-of-type)::after {
    content: '';
    cursor: pointer;
    inset: 0;
    position: absolute;
  }

  :host(:hover) {
    background-color: var(--basis-color-default-bg-hover);
  }

  :host(:active) {
    background-color: var(--basis-color-default-bg-active);
  }

  ::slotted(a:focus-visible) {
    background-color: var(--basis-focus-background-color);
    border-color: var(--basis-color-transparent);
    color: var(--basis-focus-color);
    outline-color: var(--basis-focus-outline-color);
    outline-offset: var(--basis-focus-outline-offset);
    outline-style: var(--basis-focus-outline-style);
    outline-width: var(--basis-focus-outline-width);
  }
`;
