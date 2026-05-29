import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  .theme-wizard-download-confirmation__issues {
    max-block-size: var(--todo-modal-dialog-max-block-size, 60vh);
  }
`;
