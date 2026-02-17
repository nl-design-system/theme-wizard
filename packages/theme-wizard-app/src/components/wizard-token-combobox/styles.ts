import { css } from 'lit';

export default css`
  .wizard-token-combobox__option {
    align-items: center;
    display: flex;
    gap: var(--wizard-token-combobox-option-gap, var(--basis-space-inline-md));
  }
  .wizard-token-combobox__preview--font-family {
    align-items: center;
    block-size: 32px;
    display: inline-flex;
    font-size: 24px;
    inline-size: 32px;
    justify-content: center;
    overflow: hidden;
    text-wrap: nowrap;
  }
`;
