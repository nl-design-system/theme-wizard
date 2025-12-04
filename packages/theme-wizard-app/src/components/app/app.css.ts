import { css } from 'lit';

export default css`
  /* ============================================
   APP LAYOUT
   ============================================ */
  .theme-app {
    --basis-form-control-max-inline-size: unset;

    display: flex;
    min-block-size: 100vh;
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */

  .theme-preview-main {
    display: flex;
    flex-direction: column;
    inline-size: 100%;
  }

  .theme-preview-main__title {
    display: block;
  }

  .theme-preview-main__description {
    color: var(--theme-gray-600);
    display: block;
    font-size: var(--theme-font-size-base);
    margin-block-end: var(--theme-space-6);
  }

  /* ============================================
   PREVIEW CONTAINER
   ============================================ */
  .theme-preview {
    overflow: auto;
  }

  @media print {
    /* Hide all app descendants, except those that are needed to show the preview content */
    .theme-app *:not(
      :has(.theme-preview), /* any parent of .theme-preview */
      .theme-preview, /* .theme-preview itself */
      .theme-preview * /* any child of .theme-preview */
    ) {
      display: none;
    }
  }
`;
