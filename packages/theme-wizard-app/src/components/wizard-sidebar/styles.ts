import { css } from 'lit';

export default css`
  .wizard-sidebar {
    background-color: var(--basis-color-accent-1-bg-subtle);
    block-size: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow-y: auto;
    padding-block: var(--basis-space-block-2xl);
    padding-inline: var(--basis-space-inline-2xl);
    row-gap: var(--basis-space-row-3xl);
  }
`;
