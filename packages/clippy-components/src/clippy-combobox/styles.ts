import { css } from 'lit';
export default css`
  .clippy-combobox__input-container {
    display: inline-block;
    inline-size: 100%;
    position: relative;
  }
  .clippy-combobox__current-option {
    pointer-events: none;
    position: absolute;
    display: flex;
    // Clip contents when current option exceeds input size
    inline-size: 100%;
    white-space: nowrap;
    overflow: hidden;
    align-items: center;
  }
  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }
  /* added specificity to override the align-items now that the flex direction changes */
  .clippy-combobox__option.utrecht-listbox__option {
    display: flex;
    flex-direction: column;
    align-items: unset;
  }
`;
