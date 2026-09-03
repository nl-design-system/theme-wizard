import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  /* Remove default fieldset styles */
  .wizard-starter-picker__fieldset {
    border: var(--basis-border-width-none);
    margin-block: var(--basis-space-none);
    margin-inline: var(--basis-space-none);
    padding-block: var(--basis-space-none);
    padding-inline: var(--basis-space-none);
  }

  .wizard-starter-picker__legend {
    font-family: var(--basis-heading-font-family);
    font-size: var(--basis-text-font-size-2xl);
    font-weight: var(--basis-text-font-weight-bold);
    line-height: var(--basis-text-line-height-2xl);
    margin-block-end: var(--basis-space-block-2xl);
  }

  .wizard-starter-picker__icon {
    align-self: flex-start;
    block-size: var(--basis-size-icon-md);
    color: var(--basis-color-default-color-subtle);
    inline-size: var(--basis-size-icon-md);

    .wizard-starter-picker__option[checked] & {
      color: var(--basis-color-accent-1-color-default);
    }
  }

  .wizard-starter-picker__icon svg {
    block-size: 100%;
    color: inherit;
    inline-size: 100%;
  }
`;
