import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    --clippy-token-sample-border-size: var(--basis-size-sm);
    --_clippy-token-group-table-font-family: var(
      --clippy-token-group-table-font-family,
      var(--basis-text-font-family-default)
    );
    --_clippy-token-group-table-font-size: var(--clippy-token-group-table-font-size, var(--basis-text-font-size-md));
    --_clippy-token-group-table-line-height: var(
      --clippy-token-group-table-line-height,
      var(--basis-text-line-height-md)
    );

    display: contents;
    font-family: var(--_clippy-token-group-table-font-family);
    font-size: var(--_clippy-token-group-table-font-size);
    line-height: var(--_clippy-token-group-table-line-height);
  }

  .clippy-token-group-table__table {
    inline-size: 100%;
  }

  .clippy-token-group-table__caption {
    background-color: var(--basis-color-accent-2-inverse-bg-default);
    color: var(--basis-color-accent-2-inverse-color-default);
    font-weight: var(--basis-text-font-weight-bold);
    text-align: start;
  }

  .clippy-token-group-table__head {
    background-color: var(--basis-color-default-bg-subtle);
  }

  .clippy-token-group-table__caption,
  .clippy-token-group-table__cell {
    padding-block: var(--basis-space-block-sm);
    padding-inline: var(--basis-space-inline-md);
  }

  .clippy-token-group-table__name-cell {
    font-weight: inherit;
    text-align: start;
  }

  .clippy-token-group-table__header-cell {
    font-weight: var(--basis-text-font-weight-bold);
    text-align: start;
  }

  .clippy-token-group-table__group-cell {
    background-color: var(--basis-color-accent-1-bg-subtle);
    color: var(--basis-color-accent-1-color-default);
    font-weight: var(--basis-text-font-weight-bold);
    text-align: start;
  }

  .clippy-token-group-table__token-sample {
    align-items: center;
    background-color: var(--basis-color-default-bg-subtle);
    block-size: var(--basis-size-md);
    display: flex;
    inline-size: var(--basis-size-md);
    justify-content: center;
    overflow: clip;
  }
`;
