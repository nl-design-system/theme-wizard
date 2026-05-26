import { css } from 'lit';

export default css`
  .wizard-validation-output {
    block-size: calc(2 * var(--basis-size-2xl));
    border: var(--basis-border-width-sm) solid var(--basis-color-default-border-default);
    font-family: var(--basis-text-font-family-monospace);
    white-space: pre;
  }
`;
