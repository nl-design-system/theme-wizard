import { css } from 'lit';

export default css`
  :host {
    --clippy-card-pre-header-padding-block-end: var(--basis-space-none);
    --clippy-card-pre-header-padding-block-start: var(--basis-space-none);
    --clippy-card-pre-header-padding-inline-end: var(--basis-space-none);
    --clippy-card-pre-header-padding-inline-start: var(--basis-space-none);
  }

  /* The pre-header is edge-to-edge media — round its top corners to match the card and force it
     onto its own full-width line (the region is a flex row by default). */
  ::slotted([slot='pre-header']) {
    border-start-end-radius: var(--_clippy-card-border-radius);
    border-start-start-radius: var(--_clippy-card-border-radius);
    display: block;
    inline-size: 100%;
  }
`;
