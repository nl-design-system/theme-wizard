import { css } from 'lit';

export default css`
  .wizard-token-combobox__option {
    align-items: center;
    display: flex;
    gap: var(--wizard-token-combobox-option-gap, var(--basis-space-inline-md));
  }
  .wizard-token-combobox__preview {
    block-size: 24px !important;
    inline-size: 24px !important;
  }
  .wizard-token-combobox__preview--font-family {
    align-items: center;
    display: inline-flex;
    font-size: 20px;
    justify-content: center;
    overflow: hidden;
    text-wrap: nowrap;
  }
`;
