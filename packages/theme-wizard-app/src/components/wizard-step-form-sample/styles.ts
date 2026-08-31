import { css } from 'lit';

export default css`
  :host {
    align-items: start;
    background-color: var(--basis-color-default-bg-subtle);
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-none);
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-block-size: var(--basis-size-sm);
    min-inline-size: var(--basis-size-sm);
    padding-block: var(--basis-space-block-lg);
    padding-inline: var(--basis-space-inline-xl);
    row-gap: var(--basis-space-block-sm);

    @media (forced-colors: active) {
      border-width: var(--basis-border-width-sm);
    }
  }
`;
