import { css } from 'lit';

export default css`
  :host {
    --nl-color-sample-border-radius: var(--basis-border-radius-round);
  }

  fieldset {
    border: none;
    padding: var(--basis-space-none);
  }

  legend {
    font-family: var(--basis-heading-font-family);
    font-size: var(--basis-text-font-size-2xl);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .sample {
    background-color: var(--basis-color-default-bg-subtle);
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-none);
    padding-block: var(--basis-space-block-sm);
    padding-inline: var(--basis-space-inline-md);

    @media (forced-colors: active) {
      border-width: var(--basis-border-width-sm);
    }

    clippy-card-radio-option [slot='body'] & {
      padding-block: var(--basis-space-block-xl);
      padding-inline: var(--basis-space-inline-2xl);
    }
  }
`;
