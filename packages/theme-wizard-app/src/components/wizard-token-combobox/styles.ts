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

  .wizard-token-combobox__preview--font-family,
  .wizard-token-combobox__preview--font-size {
    align-items: center;
    block-size: var(--nl-color-sample-block-size);
    display: inline-flex;
    font-size: var(--basis-text-font-size-lg);
    inline-size: var(--nl-color-sample-inline-size);
    justify-content: center;
    overflow: clip;
    text-wrap: nowrap;
  }
`;
