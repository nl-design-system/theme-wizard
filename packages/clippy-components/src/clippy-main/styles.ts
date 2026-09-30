import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    --_clippy-main-row-gap: var(--clippy-main-row-gap, var(--basis-space-row-xl));
  }

  main {
    display: grid;
    grid-template-areas:
      'header'
      'aside'
      'body';
    grid-template-rows: auto auto 1fr;
    row-gap: var(--_clippy-main-row-gap);
  }

  .clippy-main__header {
    grid-area: header;
  }

  .clippy-main__aside {
    grid-area: aside;
  }

  .clippy-main__body {
    grid-area: body;
  }

  /**
   * If the main is inside a clippy-layout-detail component, place the items in that grid.
   */
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
      grid-template-areas: initial;
    }
  }
`;
