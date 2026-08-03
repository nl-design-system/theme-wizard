import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    background: var(--basis-color-default-bg-subtle);
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--basis-space-row-2xl);
    column-gap: var(--basis-space-column-3xl);
    padding-inline: var(--basis-space-inline-3xl);
    padding-block: var(--basis-space-block-4xl);

    --nl-heading-level-3-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-3-margin-block-end: var(--basis-space-block-md);
  }
`;
