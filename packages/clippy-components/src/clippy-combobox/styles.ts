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
  }
  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }
`;
