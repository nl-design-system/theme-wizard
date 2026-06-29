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

  /* TODO: Always align ALL samples vertically. Small [start] samples also align horizontally (text-center) */
  .sample {
    background-color: var(--basis-color-default-bg-subtle);
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-none);
    padding-block: var(--basis-space-block-sm);
    padding-inline: var(--basis-space-inline-sm);
    min-inline-size: var(--basis-size-sm);
    min-block-size: var(--basis-size-sm);

    & clippy-html-image {
      & > *:not(:first-child) {
        margin-top: var(--basis-space-row-md);
      }
    }

    clippy-card-radio-option [slot='start'] & {
      text-align: center; /* TODO fix alignment on both axes */
    }

    @media (forced-colors: active) {
      border-width: var(--basis-border-width-sm);
    }

    clippy-card-radio-option [slot='body'] & {
      padding-block: var(--basis-space-block-lg);
      padding-inline: var(--basis-space-inline-xl);
    }
  }
`;
