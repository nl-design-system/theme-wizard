import { css } from 'lit';

export default css`
  .wizard-colorscale-input {
  }

  .wizard-colorscale-input__input input {
    inline-size: 100%;
  }

  .wizard-colorscale-input__list {
    display: flex;
    inline-size: 100%;
    justify-content: stretch;
  }

  .wizard-colorscale-input__stop {
    block-size: var(--basis-size-2xs);
    inline-size: 100%;
  }

  .wizard-colorscale-input__stop--seed {
    /* TODO: implement */
  }
`;
