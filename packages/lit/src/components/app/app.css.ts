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
`;
