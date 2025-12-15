import { css } from 'lit';

export default css`
  /* ============================================
   APP LAYOUT
   ============================================ */
  .wizard-app {
    --basis-form-control-max-inline-size: unset;
    --utrecht-button-primary-action-focus-background-color: var(--utrecht-button-primary-action-background-color);
    --utrecht-heading-1-font-weight: 700;

    block-size: 100vh;
    display: grid;
    font-family: var(--basis-text-font-family-default, inherit);
    grid-template-areas: 'logo nav' 'sidebar preview';
    grid-template-columns: minmax(20rem, 24rem) 1fr;
    grid-template-rows: auto 1fr;
  }

  .wizard-app__logo {
    grid-area: logo;
  }

  .wizard-app__sidebar {
    --utrecht-heading-2-font-size: var(--basis-text-font-size-lg);
    --utrecht-heading-2-margin-block-end: var(--basis-space-block-lg);
    --utrecht-heading-3-font-size: var(--basis-text-font-size-md);

    grid-area: sidebar;

    section:last-of-type {
      margin-block-start: auto;
    }

    utrecht-heading-2 {
      display: block;
      margin-block-end: var(--basis-space-block-md);
    }
  }

  .wizard-app__nav {
    background-color: var(--basis-color-accent-1-inverse-bg-default);
    color: var(--basis-color-accent-1-inverse-color-default);
    display: grid;
    grid-area: nav;
    justify-content: end;
    padding-block: var(--basis-space-block-md);
    padding-inline: var(--basis-space-inline-lg);
  }

  .wizard-app__basis-colors {
    display: grid;
    margin-block: 0;
    padding-inline-start: 0;
    row-gap: var(--basis-space-block-md);

    > li {
      list-style-type: none;
    }
  }

  .wizard-app__root-token-field {
    max-block-size: 50vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;

    @media (pointer: fine) {
      scrollbar-color: var(--basis-color-accent-1-color-default) transparent;
      scrollbar-width: thin;
    }
  }

  [type='reset'] {
    margin-block: var(--basis-space-block-md);
    min-block-size: auto;
    padding-block: 0;
    padding-inline: 0;
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */

  .wizard-app__preview {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-area: preview;
    inline-size: 100%;
    max-block-size: 100%;
    min-block-size: 100%;
    overflow: auto;
  }

  /* ============================================
   PREVIEW CONTAINER
   ============================================ */

  @media print {
    .wizard-app {
      /* Undo the grid template, making sure the preview has all room available */
      grid-template-columns: auto;
    }

    /* Hide all app descendants, except those that are needed to show the preview content */
    .wizard-app *:not(
      :has(.wizard-app__preview), /* any parent of .wizard-preview */
      .wizard-app__preview, /* .wizard-preview itself */
      .wizard-app__preview * /* any child of .wizard-preview */
    ) {
      display: none;
    }
  }
`;
