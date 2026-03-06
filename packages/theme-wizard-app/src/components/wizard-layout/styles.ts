import { css } from 'lit';

export default css`
  .wizard-layout {
    --wizard-layout-nav-padding-block: var(--basis-space-block-md);
    --wizard-layout-nav-background-color: var(--basis-color-accent-1-inverse-bg-default);

    display: grid;
    font-family: var(--basis-text-font-family-default, inherit);
    grid-template-areas: 'header header' 'main main' 'footer footer';
    grid-template-columns: minmax(20rem, 24rem) 1fr;
    grid-template-rows: auto 1fr;
    min-block-size: 100vh;
    background-color: var(--basis-color-accent-1-bg-subtle);
    container-type: inline-size;
  }

  .wizard-layout--has-sidebar {
    grid-template-areas: 'header header' 'sidebar main' 'footer footer';
  }

  .wizard-layout__header {
    inset-block-start: 0;
    position: sticky;
    z-index: 1;
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    grid-area: header;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    padding-inline: var(--basis-space-inline-lg);
  }

  .wizard-layout__sidebar {
    grid-area: sidebar;
  }

  .wizard-layout__logo {
    padding-block: var(--wizard-layout-nav-padding-block);

    & a {
      display: inline-block;
      text-decoration: none;
    }
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */

  .wizard-layout__main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-area: main;
    inline-size: 100%;
    min-block-size: 100%;
    padding-block-end: var(--basis-space-block-3xl);
    padding-inline: var(--basis-space-inline-xl);
  }

  @media print {
    .wizard-layout {
      /* Undo the grid template, making sure the main area has all room available */
      grid-template-columns: auto;
    }

    /* Hide all app descendants, except those that are needed to show the preview content */
    .wizard-layout *:not(
      :has(.wizard-layout__main), /* any parent of main */
      .wizard-layout__main, /* main itself */
      .wizard-layout__main * /* any child of main */
    ) {
      display: none;
    }
  }

  /* ============================================
   FOOTER
   ============================================ */
  .wizard-layout__footer {
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    grid-area: footer;
    padding-inline: var(--basis-space-inline-lg);
    padding-block-start: var(--basis-space-block-5xl);
    padding-block-end: var(--basis-space-block-6xl);
    display: grid;
    row-gap: var(--basis-space-row-2xl);
    column-gap: var(--basis-space-column-4xl);

    @container (inline-size > 44rem) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @container (inline-size > 80rem) {
      column-gap: var(--basis-space-column-5xl);
      grid-template-columns: repeat(auto-fit, 24rem);
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
