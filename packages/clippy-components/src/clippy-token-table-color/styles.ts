import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --nl-color-sample-block-size: var(--basis-pointer-target-min-block-size, 44px);
    --nl-color-sample-inline-size: 4rem;
    --utrecht-table-cell-padding-inline-end: 0.5rem;
    --utrecht-table-cell-padding-inline-start: 0.5rem;
  }

  .clippy-token-table-color__header-cell {
    &[scope='col'],
    &[scope='row'] {
      white-space: nowrap;
    }

    &[scope='col'] {
      --utrecht-table-header-cell-font-weight: var(--basis-text-font-weight-default);

      font-size: var(--basis-text-font-size-sm);
      line-height: var(--basis-text-line-height-sm);
      min-inline-size: 5rem;
    }

    &[scope='row'] {
      --_utrecht-table-header-cell-vertical-align: middle;

      min-inline-size: 5rem;
    }
  }

  .clippy-token-table-color__mastheader {
    border-block-end-color: var(--utrecht-table-row-border-block-end-color, transparent);
    border-block-end-style: solid;
    border-block-end-width: var(--utrecht-table-row-border-block-end-width, 0);
    display: block;
    padding-block-end: var(--utrecht-table-cell-padding-block-end, 0);
  }

  .clippy-token-table-color__cell {
    --utrecht-table-row-border-block-end-width: 0px;
  }
`;
