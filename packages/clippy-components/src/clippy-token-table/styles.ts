import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    /*--clippy-graph-paper-line-color: red;*/

    container: clippy-token-table / inline-size;
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    line-height: var(--basis-text-line-height-md);
  }

  .clippy-token-table__table {
    display: grid;
  }

  .clippy-token-table__header {
    @container clippy-token-table (inline-size < 64rem) {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  }

  .clippy-token-table__body {
    display: grid;
  }

  .clippy-token-table__row {
    display: grid;
    row-gap: var(--basis-space-row-lg);
    border-block-end-width: 1px;
    border-block-end-color: var(--basis-color-default-border-subtle);
    border-block-end-style: solid;
    padding-block-end: var(--basis-space-row-2xl);

    & + & {
      padding-block-start: var(--basis-space-row-2xl);
    }
  }

  .clippy-token-table__cell {
  }

  .clippy-token-table__head {
    display: block;
    font-weight: var(--basis-text-font-weight-bold);
  }

  .clippy-token-table__head--visual-small {
  }

  .clippy-token-table__example {
    display: block;
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-lg);
    border-width: 1px;
    border-style: solid;
    border-color: var(--basis-color-default-border-subtle);
  }

  @container clippy-token-table (inline-size >= 40rem) {
    .clippy-token-table__table {
      grid-template-columns: 1fr 1fr;
      column-gap: var(--basis-space-column-4xl);
    }

    .clippy-token-table__header,
    .clippy-token-table__body,
    .clippy-token-table__row {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
    }
  }

  @container clippy-token-table (inline-size >= 64rem) {
    .clippy-token-table__table {
      grid-template-columns: 1fr auto auto auto;
    }

    .clippy-token-table__head--visual-small {
      display: none;
    }

    .clippy-token-table__row {
      align-items: center;
      padding-block-start: var(--basis-space-row-2xl);
    }
  }
`;
