import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    flex-direction: row;
  }

  :host {
    --clippy-card-footer-padding-inline-start: var(--basis-space-none);

    align-items: center;
    justify-content: space-between;
  }
`;
