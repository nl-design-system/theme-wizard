import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    --ma-navigation-bar-content-padding-inline-start: var(--basis-space-none);
    --ma-navigation-bar-content-padding-inline-end: var(--basis-space-none);

    align-self: stretch;
    justify-content: start;
  }
`;
