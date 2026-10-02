import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    /**
     * 1. Variable to use troughout your application (eg. when the header is sticky)
     *    Gets overwritten by JS in the component
     * 2. Reusable, generic, page-level variables. Are consumed by different layouts, header and footer.
     *    Can be overwritten in the consuming component (eg. in the header component)
     */
    --clippy-page-layout-header-block-size: 0px; /* [1] */
    --clippy-page-layout-content-max-inline-size: var(--basis-page-max-inline-size);
    --clippy-page-layout-content-block-padding: var(--basis-space-block-3xl);
    --clippy-page-layout-content-inline-padding: var(--basis-space-inline-xl);

    background-color: var(--clippy-page-layout-background-color, var(--basis-color-default-bg-document));
    container-name: clippy-page-layout;
    container-type: inline-size;
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-block-size: 100vb;
  }

  /**
   * Variant: focus
   * Vertically centers everything which is slotted into the default slot.
   */
  :host([variant='focus']) {
    .clippy-page-layout__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;
