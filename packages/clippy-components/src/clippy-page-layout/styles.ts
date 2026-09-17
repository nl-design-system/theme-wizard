import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    /**
     * 1. Variable to use troughout your application (eg. when the header is sticky)
     *    Gets overwritten by JS in the component
     */
    --clippy-page-layout-header-block-size: 1lh; /* [1] */

    display: grid;
    grid-template-rows: auto 1fr auto;
    min-block-size: 100vb;
    background-color: var(--clippy-page-layout-background-color, var(--basis-color-accent-1-bg-subtle));
    container-name: clippy-page-layout;
    container-type: inline-size;
  }
`;
