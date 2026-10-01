import { css } from 'lit';

export default css`
  .wizard-token-sample {
    --wizard-basis-token-sample-size: var(--basis-size-sm);
    --clippy-token-sample-border-size: var(--wizard-basis-token-sample-size);
    --clippy-token-sample-background-color: var(--basis-color-transparent);
    --clippy-token-sample-border-color: var(--basis-color-transparent);
    --clippy-token-sample-text-border-subtle: var(--basis-color-transparent);

    background-color: var(--basis-color-default-bg-default);
    display: inline-block;
    min-block-size: var(--wizard-basis-token-sample-size);
    min-inline-size: var(--wizard-basis-token-sample-size);
    overflow: clip;
    place-content: center;
    text-align: center;
  }
`;
