import { css } from 'lit';

export default css`
  :host {
    cursor: default;
    forced-color-adjust: none;
    user-select: none;
  }

  slot[name='label'] {
    display: none;
  }
`;
