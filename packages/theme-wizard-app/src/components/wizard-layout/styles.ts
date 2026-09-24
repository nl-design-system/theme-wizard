import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .wizard-layout {
    --wizard-layout-padding-inline: var(--basis-space-inline-xl);
    --wizard-layout-body-padding-block: var(--basis-space-block-3xl);
    --wizard-layout-nav-background-color: var(--basis-color-accent-1-inverse-bg-default);
    --utrecht-listbox-option-hover-background-color: var(--basis-color-accent-1-bg-hover);
    --clippy-page-layout-background-color: var(--basis-color-accent-1-bg-subtle);

    /* Clippy-card */
    --clippy-card-background-color: var(--basis-color-default-bg-document);
    --clippy-card-border-color: var(--basis-color-default-border-subtle);
    --clippy-card-border-radius: var(--basis-border-radius-md);
    --clippy-card-border-width: var(--basis-border-width-sm);
    --clippy-card-color: var(--basis-color-default-color-default);
    --clippy-card-max-inline-size: 48rem;

    --clippy-card-hover-background-color: var(--basis-color-default-bg-hover);
    --clippy-card-hover-border-color: var(--clippy-card-border-color);

    --clippy-card-active-background-color: var(--basis-color-default-bg-active);
    --clippy-card-active-border-color: var(--clippy-card-border-color);

    --clippy-card-pre-header-column-gap: var(--basis-space-column-md);
    --clippy-card-pre-header-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-pre-header-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-pre-header-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-pre-header-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-pre-header-row-gap: var(--basis-space-row-md);

    --clippy-card-header-column-gap: var(--basis-space-column-md);
    --clippy-card-header-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-header-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-header-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-header-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-header-row-gap: var(--basis-space-row-md);
    --clippy-card-header-text-decoration: none;

    --clippy-card-body-column-gap: var(--basis-space-column-md);
    --clippy-card-body-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-body-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-body-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-body-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-body-row-gap: var(--basis-space-row-md);

    --clippy-card-footer-column-gap: var(--basis-space-column-md);
    --clippy-card-footer-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-footer-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-footer-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-footer-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-footer-row-gap: var(--basis-space-row-md);

    font-family: var(--basis-text-font-family-default, inherit);
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

  /* ============================================
   FOOTER
   ============================================ */

  .wizard-layout__footer {
    align-items: start;
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    column-gap: var(--basis-space-column-4xl);
    display: grid;
    padding-block-end: var(--basis-space-block-6xl);
    padding-block-start: var(--basis-space-block-5xl);
    padding-inline: var(--wizard-layout-padding-inline);
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
