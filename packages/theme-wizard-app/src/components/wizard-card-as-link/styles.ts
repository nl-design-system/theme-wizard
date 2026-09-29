import { css } from 'lit';

export default css`
  :host {
    --clippy-card-pre-header-padding-inline-end: var(--basis-space-none);
    --clippy-card-header-padding-block-end: var(--basis-space-none);
    --clippy-card-header-padding-block-start: var(--basis-space-none);
    --clippy-card-body-padding-block-end: var(--basis-space-none);
    --clippy-card-body-padding-block-start: var(--basis-space-block-sm);

    /* Use the default font-size when using a <clippy-heading> for the slot=heading */
    --nl-heading-level-2-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-3-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-4-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-5-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-6-font-size: var(--basis-text-font-size-md);
  }

  .clippy-card__header-body {
    padding-block-end: var(--basis-space-block-lg);
    padding-block-start: var(--basis-space-block-lg);
  }

  ::slotted([slot='body']) {
    color: var(--basis-color-default-color-subtle);
    margin-block: var(--basis-space-none);
  }

  .wizard-card-as-link__footer {
    color: var(--basis-color-default-color-subtle);
    display: inline-flex;
    transition: translate 100ms ease-out;

    @media not (prefers-reduced-motion: reduce) {
      :host(:hover) & {
        translate: var(--basis-space-inline-sm);
      }
    }
  }
`;
