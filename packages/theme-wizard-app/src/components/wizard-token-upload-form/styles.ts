import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  .wizard-token-upload-form__actions {
    column-gap: var(--basis-space-column-sm);
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--basis-space-row-sm);
  }
`;
