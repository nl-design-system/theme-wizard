import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  .clippy-popover__trigger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .clippy-popover__panel {
    background-color: var(--basis-color-default-bg-document);
    border-color: var(--basis-color-default-bg-hover);
    border-radius: var(--basis-border-radius-sm);
    border-style: solid;
    border-width: var(--basis-border-width-sm);
    box-shadow: var(--basis-color-default-bg-default) 0 1px 3px 0;
    margin: 0;
    padding: var(--basis-space-inline-md);
    position-area: block-end span-inline-start;
  }
`;
