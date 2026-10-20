import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .wizard-layout {
    --wizard-layout-padding-inline: var(--basis-space-inline-xl);
    --wizard-layout-body-padding-block: var(--basis-space-block-3xl);
  }

  /* Currently non-responsive, add flex-wrap: wrap to enable wrapping */
  .wizard-layout__body {
    align-items: stretch;
    display: flex;
    gap: var(--basis-space-column-4xl);
    min-inline-size: 0;
    padding-block: var(--wizard-layout-body-padding-block);
    padding-inline: var(--wizard-layout-padding-inline);
  }

  .wizard-layout__sidebar:not([hidden]) {
    flex-basis: 20rem;
    flex-grow: 1;
    order: 1;
  }

  .wizard-layout__aside:not([hidden]) {
    flex-basis: 12rem;
    flex-grow: 1;
    order: 3;
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */

  .wizard-layout__main {
    column-gap: var(--basis-space-row-4xl);
    display: grid;
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 62%;
    order: 2;
  }

  /* prevent slotted content from overflowing the grid layout */
  ::slotted([slot='main']) {
    min-inline-size: 0;
  }

  @media print {
    .wizard-layout {
      /* Undo the grid template, making sure the main area has all room available */
      grid-template-columns: auto;
    }

    /* Hide all app descendants, except those that are needed to show the preview content */
    .wizard-layout *:not(:has(.wizard-layout__main), .wizard-layout__main, .wizard-layout__main *) {
      display: none;
    }
  }
`;
