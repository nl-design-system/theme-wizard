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
    display: block;
    // Clip contents when current option exceeds input size
    inline-size: 100%;
    white-space: nowrap;
    overflow: hidden;
  }
  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }
`;
