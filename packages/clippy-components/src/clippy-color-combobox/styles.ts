import { css } from 'lit';

export default css`
  .clippy-color-combobox__option {
    align-items: center;
    display: flex;
    gap: var(
      --clippy-color-combobox-option-gap,
      var(--utrecht-textbox-padding-inline-end, var(--utrecht-form-control-padding-inline-end, initial))
    );
  }
`;
