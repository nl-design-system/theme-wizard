import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .theme-app {
    block-size: 100vh;
    display: grid;
    grid-template-areas: 'sidebar preview';
    grid-template-columns: var(--theme-sidebar-width) 1fr;
    overflow: hidden;
  }

  .theme-preview-main {
    background: var(--theme-gray-100);
    display: flex;
    flex-direction: column;
    grid-area: preview;
    overflow: hidden;
    padding: var(--theme-space-6);
  }

  .theme-preview-main__title {
    color: var(--theme-gray-900);
    font-family: var(--theme-font-family);
    font-size: var(--theme-font-size-lg);
    font-weight: var(--theme-font-weight-bold);
    margin: 0 0 var(--theme-space-2) 0;
  }

  .theme-preview-main__description {
    color: var(--theme-gray-700);
    font-family: var(--theme-font-family);
    font-size: var(--theme-font-size-base);
    line-height: 1.5;
    margin: 0 0 var(--theme-space-6) 0;
  }

  .theme-preview {
    background: white;
    border-radius: var(--theme-border-radius);
    box-shadow: var(--theme-shadow);
    flex: 1;
    overflow: hidden;
  }
`;
