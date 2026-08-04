import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    --nl-heading-level-3-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-3-margin-block-end: var(--basis-space-block-md);

    background: var(--basis-color-default-bg-subtle);
    column-gap: var(--basis-space-column-3xl);
    display: flex;
    flex-wrap: wrap;
    padding-block: var(--basis-space-block-4xl);
    padding-inline: var(--basis-space-inline-3xl);
    row-gap: var(--basis-space-row-2xl);
  }

  .wizard-story-matches__empty {
    color: var(--basis-color-default-color-subtle);
  }
`;
