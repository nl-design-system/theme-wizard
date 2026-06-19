import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  ::slotted([slot="iconStart"]) {
    align-self: var(--clippy-task-navigation-icon-start-align, center);
  }
`;
