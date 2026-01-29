import { css } from 'lit';

export default css`
  .wizard-layout {
    --wizard-layout-nav-padding-block: var(--basis-space-block-md);
    --wizard-layout-nav-background-color: var(--basis-color-accent-1-inverse-bg-default);

    display: grid;
    font-family: var(--basis-text-font-family-default, inherit);
    grid-template-areas: 'logo nav' 'sidebar main';
    grid-template-columns: minmax(20rem, 24rem) 1fr;
    grid-template-rows: auto 1fr;
    min-block-size: 100vh;
  }

  .wizard-layout__logo {
    background-color: var(--wizard-layout-nav-background-color);
    grid-area: logo;
    padding-block: var(--wizard-layout-nav-padding-block);
  }

  .wizard-layout__sidebar {
    grid-area: sidebar;
  }

  .wizard-layout__nav {
    background-color: var(--wizard-layout-nav-background-color);
    color: var(--basis-color-accent-1-inverse-color-default);
    display: flex;
    grid-area: nav;
    justify-content: space-between;
    padding-inline: var(--basis-space-inline-lg);
  }

  .wizard-layout__nav-slot {
    display: grid;
    justify-content: end;
    align-items: center;
  }

  .wizard-layout__nav-item,
  .wizard-layout__nav ::slotted(a[href]) {
    --utrecht-link-color: #fff;
    --utrecht-link-text-decoration: none;

    align-content: center;
    border-block-start-style: solid;
    border-block-start-width: 4px;
    border-color: #0000;
    box-sizing: border-box;
    display: inline-block;
    font-weight: var(--basis-text-font-weight-bold);
    line-height: 2;
    min-block-size: 100%;
    padding-block: var(--basis-space-block-md);
    padding-inline: var(--basis-space-inline-lg);

    &:hover {
      background-color: var(--ma-navigation-bar-item-hover-background-color);
      border-block-start-color: var(--ma-navigation-bar-item-hover-border-color);
      color: var(--ma-navigation-bar-item-hover-color);
    }

    &[aria-current='page'] {
      background-color: var(--ma-navigation-bar-item-active-background-color);
      border-block-start-color: var(--ma-navigation-bar-item-active-border-color);
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
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-lg);
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
