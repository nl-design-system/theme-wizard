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
    row-gap: var(--_clippy-main-row-gap);
  }

  /**
   * If the main is inside a clippy-layout component with the 'detail' purpose enable
   * the detail purpose here as well. This places the main as a subgrid on the clippy-layout component.
   */
  :host([purpose='detail']) {
    /**
     * The host and the main need to pass the parent grid to the children
     */
    &,
    main {
      grid-column-end: aside;
      grid-column-start: header;
      grid-row-end: body;
      grid-row-start: header;
      grid-template-areas: initial;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
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
  }
`;
