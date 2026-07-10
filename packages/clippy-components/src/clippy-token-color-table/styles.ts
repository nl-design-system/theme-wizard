import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  .clippy-token-color-table__header-cell {
    &[scope='row'] {
      white-space: nowrap;
    }
  }
`;
