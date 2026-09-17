import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    grid-template-rows: auto 1fr auto;
    min-block-size: 100vb;
    background-color: var(--clippy-page-layout-background-color, var(--basis-color-accent-1-bg-subtle));
    container-name: clippy-page-layout;
    container-type: inline-size;
  }
`;
