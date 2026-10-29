import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
    flex-direction: column;
    row-gap: var(--basis-space-row-2xl);
  }
`;
