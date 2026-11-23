import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    --clippy-token-sample-border-size: var(--basis-size-sm);
    display: contents;
  }

  caption {
    text-align: start;
    background-color: var(--basis-color-accent-2-inverse-bg-default);
    color: var(--basis-color-accent-2-inverse-color-default);
    font-weight: var(--basis-text-font-weight-bold);
  }

  thead {
    background-color: var(--basis-color-default-bg-subtle);
  }

  caption,
  td,
  th {
    padding-inline: var(--basis-space-inline-md);
    padding-block: var(--basis-space-block-sm);
  }

  th {
    text-align: start;
    font-weight: var(--basis-text-font-weight-bold);
  }

  td[colspan] {
    background-color: var(--basis-color-accent-1-bg-subtle);
    color: var(--basis-color-accent-1-color-default);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .wizard-tokens-table__token-sample {
    inline-size: var(--basis-size-md);
    block-size: var(--basis-size-md);
    background-color: var(--basis-color-default-bg-subtle);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: clip;
  }
`;
