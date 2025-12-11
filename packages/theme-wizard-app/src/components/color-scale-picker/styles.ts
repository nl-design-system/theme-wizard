import { css } from 'lit';

export default css`
  .color-scale-picker {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: var(--basis-space-inline-md);
    align-items: center;
  }

  label {
    grid-column: 1 / -1;
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
