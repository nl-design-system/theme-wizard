import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  /**
   * The host and the main need to pass the parent grid to the children
   */
  :host,
  main {
    border: 3px solid hotpink;
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
    background-color: blue;
    grid-area: header;
  }

  .clippy-layout-main__aside {
    background-color: green;
    grid-area: aside;
  }

  .clippy-layout-main__body {
    background-color: red;
    grid-area: body;
  }
`;
