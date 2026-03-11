import { css } from 'lit';

export default css`
  :host {
    --nl-heading-level-1-color: var(--basis-color-accent-1-inverse-color-default);
    --nl-heading-level-1-font-size: var(--basis-text-font-size-lg);
    --nl-heading-level-1-margin-block-start: 0;
    --nl-heading-level-1-margin-block-end: 0;

    align-items: center;
    background-color: var(--basis-color-accent-1-inverse-bg-default);
    display: flex;
  }

  .wizard-logo {
    align-items: center;
    color: var(--basis-color-accent-1-inverse-color-default);
    column-gap: var(--basis-space-column-md);
    display: flex;

    & > svg {
      block-size: var(--basis-size-sm);
    }
  }
`;
