import { css } from 'lit';

export default css`
  :host {
    --utrecht-heading-1-color: var(--basis-color-accent-1-inverse-color-default);
    --utrecht-heading-1-font-size: var(--basis-text-font-size-lg);
    --utrecht-heading-1-margin-block-start: 0;
    --utrecht-heading-1-margin-block-end: 0;

    align-items: center;
    background-color: var(--basis-color-accent-1-inverse-bg-default);
    block-size: 100%;
    display: flex;
    padding-inline: var(--basis-space-inline-lg);
  }

  .wizard-logo {
    align-items: center;
    color: var(--basis-color-accent-1-inverse-color-default);
    column-gap: var(--basis-space-column-sm);
    display: flex;
  }

  span {
    display: block;
  }
`;
