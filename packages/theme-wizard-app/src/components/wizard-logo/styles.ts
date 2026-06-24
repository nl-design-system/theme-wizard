import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    align-items: center;
    background-color: var(--basis-color-accent-1-inverse-bg-default);
  }

  .wizard-logo {
    align-items: center;
    color: var(--basis-color-accent-1-inverse-color-default);
    column-gap: var(--basis-space-column-md);
    display: flex;

    & > svg {
      block-size: var(--basis-size-sm);
      inline-size: auto;
    }
  }

  .wizard-logo__text {
    color: var(--basis-color-accent-1-inverse-color-default);
    font-family: var(--basis-heading-font-family);
    font-size: var(--basis-text-font-size-lg);
    font-weight: var(--basis-text-font-weight-bold);
    margin-block: 0;
  }
`;
