import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: inline-block;
  }

  /* Remove the whitespace below the color sample */
  .nl-color-sample {
    vertical-align: middle;
  }
`;
