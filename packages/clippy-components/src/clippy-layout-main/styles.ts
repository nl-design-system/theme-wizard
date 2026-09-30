import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host([variant='detail']) {
    /**
     * The host and the main need to pass the parent grid to the children
     */
    &,
    main {
      grid-column-end: aside;
      grid-column-start: header;
      grid-row-end: body;
      grid-row-start: header;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
    }

    main {
      display: grid;
    }

    .clippy-layout-main__header {
      grid-area: header;
    }

    .clippy-layout-main__aside {
      grid-area: aside;
    }

    .clippy-layout-main__body {
      grid-area: body;
    }
  }
`;
