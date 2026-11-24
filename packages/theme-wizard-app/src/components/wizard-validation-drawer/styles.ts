import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .wizard-validation-drawer__toggle--has-notification {
    position: relative;

    &::after {
      background-color: #f14848;
      block-size: var(--basis-space-inline-md);
      border-radius: var(--basis-border-radius-round);
      content: '';
      inline-size: var(--basis-space-inline-md);
      inset-block-start: var(--basis-space-inline-lg);
      inset-inline-start: var(--basis-space-inline-2xl);
      pointer-events: none;
      position: absolute;
    }
  }
`;
