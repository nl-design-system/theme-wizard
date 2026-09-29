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

    /* grid-row: header / body; */
    grid-row-start: header;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
  }

  ::slotted([slot='header']) {
    background-color: blue;
    grid-area: header;
  }

  ::slotted([slot='aside']) {
    background-color: green;
    grid-area: aside;
  }

  ::slotted(:not([slot])) {
    background-color: red;
    grid-area: body;
  }
`;
