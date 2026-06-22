import { css } from 'lit';

export default css`
  :host {
    cursor: default;
    user-select: none;
  }

  slot[name='label'] {
    display: none;
  }
`;
