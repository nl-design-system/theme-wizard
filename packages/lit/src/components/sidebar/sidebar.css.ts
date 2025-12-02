import { css } from 'lit';

export default css`
  /* ============================================
   COMPONENT BASE
   ============================================ */
  :host {
    inline-size: 36rem;
  }

  /* ============================================
   SIDEBAR LAYOUT & STRUCTURE
   ============================================ */
  .theme-sidebar {
    background: var(--basis-color-accent-1-bg-subtle);
    color: var(--basis-color-default-color-document);
    block-size: 100%;
    inset-block-start: 0;
    max-block-size: 100vh;
    overflow-y: auto;
    position: sticky;
    scrollbar-color: var(--basis-color-accent-1-color-default) var(--basis-color-accent-1-bg-subtle);
  }

  .theme-sidebar__form {
    display: flex;
    flex-direction: column;
    column-gap: var(--basis-space-inline-md);
  }

  .theme-sidebar__section {
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-lg);
  }

  .theme-sidebar__actions {
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-inline-md);
  }

  /* ============================================
   SIDEBAR TYPOGRAPHY
   ============================================ */
  .theme-sidebar__title {
    font-size: var(--theme-font-size-lg);
    font-weight: var(--basis-text-font-weight-bold);
    margin-block-start: 0;
    margin-block-end: var(--theme-space-1);
    background-color: var(--basis-color-accent-1-inverse-bg-default);
    color: var(--basis-color-accent-1-inverse-color-default);
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-lg);
  }

  .theme-sidebar__subtitle {
    color: var(--theme-gray-600);
    font-size: var(--theme-font-size-base);
    letter-spacing: 0.05em;
    margin-block-end: var(--theme-space-8);
    text-transform: uppercase;
  }

  /* ============================================
   FORM COMPONENTS & INPUTS
   ============================================ */

  .theme-form-field {
    display: flex;
    flex-direction: column;
    gap: var(--theme-space-1);
    margin-block-end: var(--theme-space-4);
  }

  .theme-sidebar__form--single-line {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr max-content;
    gap: var(--basis-space-inline-sm);

    & .theme-form-field__label {
      grid-row: 1;
      grid-column: 1/ -1;
    }
  }

  .theme-form-field__label {
    font-weight: var(--basis-text-font-weight-bold);
  }
`;
