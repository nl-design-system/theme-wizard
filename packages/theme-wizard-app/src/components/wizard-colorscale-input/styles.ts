import { css } from 'lit';

export default css`
  .wizard-colorscale-input {
    display: grid;
    row-gap: var(--basis-space-block-xs);
  }

  .wizard-colorscale-input__label {
    display: flex;
    justify-content: space-between;
  }

  .wizard-colorscale-input__input input {
    inline-size: 100%;
  }

  .wizard-colorscale-input__list {
    border-block-end: 2px solid currentColor;
    display: flex;
    inline-size: 100%;
    justify-content: stretch;
  }

  .wizard-colorscale-input__stop {
    block-size: 0.75em;
    inline-size: 100%;
  }
`;
