import { css } from 'lit';

export default css`
  :host {
    --nl-color-sample-border-radius: var(--basis-border-radius-round);
  }

  .wizard-step-form__fieldset {
    border: none;
    padding: var(--basis-space-none);
  }

  .wizard-step-form__legend {
    font-family: var(--basis-heading-font-family);
    font-size: var(--basis-text-font-size-2xl);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .wizard-step-form__sample {
    background-color: var(--basis-color-default-bg-subtle);
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-none);
    padding-block: var(--basis-space-block-sm);
    padding-inline: var(--basis-space-inline-sm);
    min-inline-size: var(--basis-size-sm);
    min-block-size: var(--basis-size-sm);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    row-gap: var(--basis-space-block-sm);

    @media (forced-colors: active) {
      border-width: var(--basis-border-width-sm);
    }
  }

  .wizard-step-form__sample-start {
    align-items: center;
  }

  .wizard-step-form__sample-body {
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-xl);
  }
`;
