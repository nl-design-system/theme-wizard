import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --nl-color-sample-border-radius: var(--basis-border-radius-round);
    --nl-color-sample-block-size: var(--basis-size-xs);
    --nl-color-sample-inline-size: var(--basis-size-xs);
  }

  .wizard-colorscale-input__input input {
    inline-size: 100%;
  }

  .wizard-colorscale-input__list {
    display: flex;
    inline-size: 100%;
    justify-content: stretch;
    max-inline-size: min(100%, var(--utrecht-textbox-max-inline-size, var(--utrecht-form-control-max-inline-size)));
  }

  .wizard-colorscale-input__stop {
    block-size: var(--basis-size-3xs);
    inline-size: 100%;
  }
`;
