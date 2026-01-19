import { css } from 'lit';

export default css`
  .clippy-button--small {
    --nl-button-min-inline-size: var(--clippy-button-small-min-inline-size, 32px);
    --nl-button-min-block-size: var(--clippy-button-small-min-block-size, 32px);
    --clippy-icon-size: var(--clippy-button-small-icon, 18px);
  }
`;
