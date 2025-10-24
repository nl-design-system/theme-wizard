import { css } from 'lit';

export default css`
  .theme-color-select__options {
    display: flex;
    flex-wrap: wrap;
  }
  .theme-color-select__option {
    border: 1px solid transparent;
    inline-size: fit-content;
    position: relative;
  }
  .theme-color-select__option input {
    position: absolute;
    visibility: hidden;
  }
  .theme-color-select__option input:checked {
    visibility: visible;
  }
  .theme-color-select__option:has(> input:checked) {
    border-color: currentColor;
  }
  .theme-color-select__swatch {
    block-size: 2rem;
    display: grid;
    inline-size: 10ch;
  }
`;
