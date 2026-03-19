import { css } from 'lit';

export default css`
  :host {
    --nl-color-sample-border-radius: var(--basis-border-radius-round);
    --nl-color-sample-block-size: var(--basis-size-xs);
    --nl-color-sample-inline-size: var(--basis-size-xs);
  }

  .wizard-token-combobox__option {
    align-items: center;
    display: flex;
    gap: var(--wizard-token-combobox-option-gap, var(--basis-space-inline-md));
  }

  .wizard-token-combobox__preview--font-family {
    align-items: center;
    display: inline-flex;
    font-size: var(--basis-text-font-size-lg);
    justify-content: center;
    overflow: hidden;
    text-wrap: nowrap;
  }
`;
