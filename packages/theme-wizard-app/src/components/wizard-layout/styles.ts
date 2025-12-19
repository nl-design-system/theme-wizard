import { css } from 'lit';

export default css`
  .wizard-layout {
    block-size: 100vh;
    display: grid;
    font-family: var(--basis-text-font-family-default, inherit);
    grid-template-areas: 'logo nav' 'sidebar main';
    grid-template-columns: minmax(20rem, 24rem) 1fr;
    grid-template-rows: auto 1fr;
  }

  .wizard-layout__logo {
    grid-area: logo;
  }

  .wizard-layout__sidebar {
    grid-area: sidebar;
  }

  .wizard-layout__nav {
    background-color: var(--basis-color-accent-1-inverse-bg-default);
    color: var(--basis-color-accent-1-inverse-color-default);
    grid-area: nav;
    padding-block: var(--basis-space-block-md);
    padding-inline: var(--basis-space-inline-lg);
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
    max-block-size: 100%;
    min-block-size: 100%;
    overflow: auto;
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
`;
