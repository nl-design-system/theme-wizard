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
  .theme-sidebar {
    background: var(--theme-gray-100);
    block-size: 100%;
    border-inline-end: 1px solid var(--theme-gray-400);
    inset-block-start: 0;
    max-block-size: 100vh;
    overflow-y: auto;
    padding-block: var(--theme-space-6);
    padding-inline: var(--theme-space-6);
    position: sticky;
    inline-size: 320px;
  }

  .theme-sidebar__form {
    display: flex;
    flex-direction: column;
    gap: var(--theme-space-2);
  }

  .theme-sidebar__section {
    margin-block-end: var(--theme-space-6);
    padding-block-end: var(--theme-space-6);
  }

  .theme-sidebar__section:not(:last-of-type) {
    border-block-end: 1px solid var(--theme-gray-200);
  }

  .theme-sidebar__actions {
    display: flex;
    flex-direction: column;
    gap: var(--theme-space-3);
  }

  /* ============================================
   SIDEBAR TYPOGRAPHY
   ============================================ */
  .theme-sidebar__title {
    color: var(--theme-gray-900);
    font-size: var(--theme-font-size-lg);
    font-weight: var(--theme-font-weight-bold);
    margin-block-end: var(--theme-space-1);
  }

  .theme-sidebar__subtitle {
    color: var(--theme-gray-600);
    font-size: var(--theme-font-size-base);
    letter-spacing: 0.05em;
    margin-block-end: var(--theme-space-8);
    text-transform: uppercase;
  }

  .theme-sidebar__heading {
    color: var(--theme-gray-700);
    font-size: var(--theme-font-size-base);
    font-weight: var(--theme-font-weight-bold);
    letter-spacing: 0.025em;
    margin-block-end: var(--theme-space-4);
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

  .theme-form-field__label {
    color: var(--theme-gray-700);
    display: block;
    font-size: var(--theme-font-size-base);
    font-weight: var(--theme-font-weight-semibold);
    margin-block-end: 0.375rem;
  }

  .theme-form-field__help {
    color: var(--theme-gray-600);
    display: block;
    font-size: var(--theme-font-size-sm);
    font-style: italic;
    margin-block-start: 0.25rem;
  }

  .theme-form-field__input,
  .theme-css-input {
    border: 1px solid var(--theme-gray-400, #999);
    border-radius: var(--theme-border-radius);
    font-family: inherit;
    font-size: var(--theme-font-size-base);
    padding-block: var(--theme-space-2);
    padding-inline: var(--theme-space-3);
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease;
  }

  .theme-css-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .theme-form-field__input:focus,
  .theme-css-input:focus {
    border-color: var(--theme-primary);
    box-shadow: 0 0 0 2px rgb(0 123 255 / 25%);
    outline: none;
  }
`;
