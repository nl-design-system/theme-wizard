import { css } from 'lit';
export default css`
  .clippy-combobox__input-container {
    display: inline-block;
    inline-size: 100%;
    position: relative;
  }

  .clippy-combobox__current-option {
    align-items: center;
    display: flex;
    inline-size: 100%;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
  }

  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }

  /* added specificity to override the align-items now that the flex direction changes */
  .clippy-combobox__option[class] {
    align-items: unset;
    display: flex;
    flex-direction: column;
  }
`;
