import { css } from 'lit';

export default css`
  /* ============================================
   COMPONENT BASE
   ============================================ */
  :host {
    font-family: var(--theme-font-family);
    min-inline-size: var(--theme-sidebar-width);
  }

  /* ============================================
   SIDEBAR LAYOUT & STRUCTURE
   ============================================ */
  .wizard-sidebar {
    background: var(--theme-gray-100);
    block-size: 100%;
    border-inline-end: 1px solid var(--theme-gray-400);
    inline-size: 320px;
    inset-block-start: 0;
    max-block-size: 100vh;
    overflow-y: auto;
    padding-block: var(--theme-space-6);
    padding-inline: var(--theme-space-6);
    position: sticky;
  }
`;
