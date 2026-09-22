import { css } from 'lit';

export default css`
  :host {
    --clippy-card-border-radius: var(--basis-border-radius-none);
    --clippy-card-border-width: var(--basis-border-width-none);
    --clippy-card-footer-padding-inline-start: var(--basis-space-none);

    align-items: center;
    border-block-end-width: var(--basis-border-width-sm);
    flex-direction: row;
  }

  .clippy-card__header {
    flex: 1;
  }
`;
