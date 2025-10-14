import { css } from 'lit';

export default css`
  /* ============================================
   COMPONENT BASE
   ============================================ */
  :host {
    font-family: var(--theme-font-family);
  }

  /* ============================================
   APP LAYOUT
   ============================================ */
  .theme-app {
    display: flex;
    min-block-size: 100vh;
  }

  /* ============================================
   MAIN CONTENT AREA
   ============================================ */
  .theme-preview-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-inline-size: 0;
    overflow-y: auto;
    padding-block: var(--theme-space-8);
    padding-inline: var(--theme-space-8);
  }

  .theme-preview-main__title {
    color: var(--theme-gray-900);
    display: block;
    font-size: var(--theme-font-size-lg);
    font-weight: var(--theme-font-weight-bold);
    margin-block-end: var(--theme-space-2);
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
    background: white;
    border: 1px solid var(--theme-gray-400);
    border-radius: var(--theme-border-radius);
    box-shadow: var(--theme-shadow-light);
    flex: 1;
    min-block-size: 500px;
    min-inline-size: 400px;
    overflow: auto;
    padding-block: 0;
    padding-inline: 0;
  }
`;
