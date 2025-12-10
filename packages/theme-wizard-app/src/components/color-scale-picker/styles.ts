import { css } from 'lit';

export default css`
  .color-scale-picker {
    display: flex;
    gap: var(--basis-space-inline-md);
    align-items: center;
  }

  .theme-color-scale__list {
    display: flex;
    justify-content: stretch;
    width: 100%;
    border-bottom: 3px solid currentColor;
  }

  .theme-color-scale__stop {
    block-size: 1em;
    inline-size: 100%;
  }
`;
