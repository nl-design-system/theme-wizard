import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;

    --nl-color-sample-block-size: var(--basis-pointer-target-min-block-size, 44px);
    --nl-color-sample-inline-size: var(--basis-pointer-target-min-block-size, 44px);
  }

  .clippy-token-color-table__header-cell {
    &[scope='row'],
    &[scope='col'] {
      white-space: nowrap;
    }
    &[scope='row'] {
      --_utrecht-table-header-cell-vertical-align: middle;
      min-inline-size: 5rem;
    }
    &[scope='col'] {
      --utrecht-table-header-cell-font-weight: var(--basis-text-font-weight-default);
      min-inline-size: 5rem;
    }
  }

  .clippy-token-color-table__mastheader {
    display: block;
    padding-block-end: var(--utrecht-table-cell-padding-block-end, 0);
    border-block-end-color: var(--utrecht-table-row-border-block-end-color, transparent);
    border-block-end-style: solid;
    border-block-end-width: var(--utrecht-table-row-border-block-end-width, 0);
  }

  .clippy-token-color-table__cell {
    --utrecht-table-row-border-block-end-width: 0px;
  }
`;
