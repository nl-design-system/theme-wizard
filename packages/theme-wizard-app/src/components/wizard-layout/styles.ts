import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  .wizard-layout {
    --wizard-layout-body-template-rows: minmax(var(--basis-size-md), auto) 1fr;
    --wizard-layout-nav-padding-block: var(--basis-space-block-md);
    --wizard-layout-nav-background-color: var(--basis-color-accent-1-inverse-bg-default);
    --utrecht-listbox-option-hover-background-color: var(--basis-color-accent-1-bg-hover);

    background-color: var(--basis-color-accent-1-bg-subtle);
    column-gap: var(--basis-space-inline-lg);
    container-type: inline-size;
    display: grid;
    font-family: var(--basis-text-font-family-default, inherit);
    grid-template-areas: 'header' 'main' 'footer';
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    min-block-size: 100vh;
  }

  .wizard-layout__header {
    align-items: center;
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    display: grid;
    grid-area: header;
    grid-template-columns: auto 1fr;
    inset-block-start: 0;
    padding-inline: var(--basis-space-inline-lg);
    position: sticky;
    z-index: 1;

    @media (forced-colors: active) {
      border-block-end: var(--basis-border-width-sm) solid;
    }
  }

  .wizard-layout__body {
    align-items: start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--basis-space-column-4xl);
    grid-area: main;
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-xl);
  }

  .wizard-layout__sidebar:not([hidden]) {
    display: grid;
    flex-basis: 20rem;
    flex-grow: 1;
  }

  .wizard-layout__logo {
    padding-block: var(--wizard-layout-nav-padding-block);
    text-decoration: none;
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */

  .wizard-layout__main {
    display: grid;
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
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

  /* ============================================
   FOOTER
   ============================================ */
  .wizard-layout__footer {
    align-items: start;
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    column-gap: var(--basis-space-column-4xl);
    display: grid;
    grid-area: footer;
    padding-block-end: var(--basis-space-block-6xl);
    padding-block-start: var(--basis-space-block-5xl);
    padding-inline: var(--basis-space-inline-lg);
    row-gap: var(--basis-space-row-2xl);

    @media (forced-colors: active) {
      border-block-start: var(--basis-border-width-sm) solid;
    }

    @container (inline-size > 44rem) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @container (inline-size > 86rem) {
      column-gap: var(--basis-space-column-5xl);
      grid-template-columns: repeat(auto-fit, fit-content);
    }

    :any-link {
      color: var(--basis-color-accent-1-inverse-color-default);
    }
  }

  .wizard-layout__footer-about {
    text-wrap: balance;

    /* Vertically align with the first link in the nav to have the same baseline */
    > :first-child {
      margin-block-start: var(--basis-space-block-md);
    }
  }

  .wizard-layout__footer-nav {
    display: grid;
    row-gap: var(--basis-space-row-lg);
  }

  .wizard-layout__footer-nav-link {
    display: block;
    padding-block: var(--basis-space-block-sm);
  }
`;
