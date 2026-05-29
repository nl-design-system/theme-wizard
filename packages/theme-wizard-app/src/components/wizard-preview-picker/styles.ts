import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  form {
    align-items: center;
    column-gap: var(--basis-space-column-sm);
    display: flex;
  }
`;
