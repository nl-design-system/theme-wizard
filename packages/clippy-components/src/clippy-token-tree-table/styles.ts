import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    --clippy-token-sample-border-size: var(--basis-size-sm);

    display: contents;
  }

  .clippy-token-tree-table__table {
    inline-size: 100%;
  }

  .clippy-token-tree-table__caption {
    background-color: var(--basis-color-accent-2-inverse-bg-default);
    color: var(--basis-color-accent-2-inverse-color-default);
    font-weight: var(--basis-text-font-weight-bold);
    text-align: start;
  }

  .clippy-token-tree-table__head {
    background-color: var(--basis-color-default-bg-subtle);
  }

  .clippy-token-tree-table__caption,
  .clippy-token-tree-table__cell {
    padding-block: var(--basis-space-block-sm);
    padding-inline: var(--basis-space-inline-md);
  }

  .clippy-token-tree-table__header-cell {
    font-weight: var(--basis-text-font-weight-bold);
    text-align: start;
  }

  .clippy-token-tree-table__group-cell {
    background-color: var(--basis-color-accent-1-bg-subtle);
    color: var(--basis-color-accent-1-color-default);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .clippy-token-tree-table__token-sample {
    align-items: center;
    background-color: var(--basis-color-default-bg-subtle);
    block-size: var(--basis-size-md);
    display: flex;
    inline-size: var(--basis-size-md);
    justify-content: center;
    overflow: clip;
  }
`;
