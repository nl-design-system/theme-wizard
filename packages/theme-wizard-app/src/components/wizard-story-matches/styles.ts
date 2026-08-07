import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    --nl-heading-level-3-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-3-margin-block-end: var(--basis-space-block-md);

    column-gap: var(--basis-space-column-3xl);
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--basis-space-row-2xl);
  }

  .wizard-story-matches__empty {
    color: var(--basis-color-default-color-subtle);
  }
`;
