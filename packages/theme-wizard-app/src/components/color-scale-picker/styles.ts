import { css } from 'lit';

export default css`
  .color-scale-picker {
    display: grid;
    row-gap: var(--basis-space-block-xs);
  }

  .label {
    display: flex;
    justify-content: space-between;
  }

  .input input {
    inline-size: 100%;
  }

  .theme-color-scale__list {
    display: flex;
    justify-content: stretch;
    width: 100%;
    border-bottom: 2px solid currentColor;
  }

  .theme-color-scale__stop {
    block-size: 0.75em;
    inline-size: 100%;
  }
`;
