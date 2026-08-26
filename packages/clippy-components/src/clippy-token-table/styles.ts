import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --clippy-graph-paper-major-line-color: transparent;
    --_clippy-token-table-font-family: var(--clippy-token-table-font-family, var(--basis-text-font-family-default));
    --_clippy-token-table-font-size: var(--clippy-token-table-font-size, var(--basis-text-font-size-md));
    --_clippy-token-table-line-height: var(--clippy-token-table-line-height, var(--basis-text-line-height-md));
    --_clippy-token-table-row-gap: var(--clippy-token-table-row-gap, var(--basis-space-row-lg));
    --_clippy-token-table-column-gap: var(--clippy-token-table-column-gap, var(--basis-space-column-4xl));

    /* Head */
    --_clippy-token-table-head-font-weight: var(
      --clippy-token-table-head-font-weight,
      var(--basis-text-font-weight-bold)
    );

    /* Row */
    --_clippy-token-table-row-border-color: var(
      --clippy-token-table-row-border-color,
      var(--basis-color-default-border-subtle)
    );
    --_clippy-token-table-row-padding-block: var(--clippy-token-table-row-padding-block, var(--basis-space-row-2xl));

    container: clippy-token-table / inline-size;
    font-family: var(--_clippy-token-table-font-family);
    font-size: var(--_clippy-token-table-font-size);
    line-height: var(--_clippy-token-table-line-height);
  }

  .clippy-token-table__table {
    display: grid;
  }

  .clippy-token-table__header {
    @container clippy-token-table (inline-size < 64rem) {
      /* stylelint-disable */
      block-size: 1px;
      border-width: 0;
      clip: rect(0, 0, 0, 0);
      inline-size: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      /* stylelint-enable */
    }
  }

  .clippy-token-table__body {
    display: grid;
  }

  .clippy-token-table__row {
    border-block-end-color: var(--_clippy-token-table-row-border-color);
    border-block-end-style: solid;
    border-block-end-width: 1px;
    display: grid;
    padding-block-end: var(--_clippy-token-table-row-padding-block);
    row-gap: var(--_clippy-token-table-row-gap);

    & + & {
      padding-block-start: var(--_clippy-token-table-row-padding-block);
    }
  }

  .clippy-token-table__head {
    display: block;
    font-weight: var(--basis-text-font-weight-bold);
  }

  .clippy-token-table__example {
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: 1px;
    display: block;
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-lg);
  }

  .clippy-token-table__example--clean {
    --clippy-graph-paper-line-color: transparent;
  }

  .clippy-token-table__value {
    display: flex;
    align-items: center;
    gap: var(--basis-space-text-md);
  }

  /**
   * Extends nl-button--subtle
   * 1. Because the subtle button has a transparent background we want to align the button label
   *    with the rest of the table, so we pull it to the side.
   */
  .clippy-token-table__details-button {
    margin-inline-start: calc(-1 * var(--nl-button-padding-inline-start));
    white-space: nowrap;
  }

  @container clippy-token-table (inline-size >= 40rem) {
    .clippy-token-table__table {
      column-gap: var(--_clippy-token-table-column-gap);
      grid-template-columns: 1fr 1fr;
    }

    .clippy-token-table__header,
    .clippy-token-table__body,
    .clippy-token-table__row {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
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
      padding-block-start: var(--_clippy-token-table-row-padding-block);
    }
  }
`;
