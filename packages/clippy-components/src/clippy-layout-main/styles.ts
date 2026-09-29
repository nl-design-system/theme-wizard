import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  main {
    border: 3px solid hotpink;
    display: grid;
    grid-column-end: aside;
    grid-column-start: header;
    grid-row-end: body;
    grid-row-start: header;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
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
