import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    /* In this rule to match the specificity of that in clippy-card */
    flex-direction: row;
  }

  :host {
    --clippy-card-border-radius: var(--basis-border-radius-none);
    --clippy-card-border-width: var(--basis-border-width-none);
    --clippy-card-footer-padding-inline-start: var(--basis-space-none);

    align-items: center;
    column-gap: var(--basis-space-column-md);
    border-block-end-width: var(--basis-border-width-sm);
  }

  .clippy-card__header {
    flex: 1;
  }

  .clippy-card__pre-header {
    padding-inline-end: var(--basis-space-none);
  }
`;
