import { css } from 'lit';

export const groupStyles = css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    flex-direction: column;
    row-gap: var(--basis-space-row-lg);
  }
`;
