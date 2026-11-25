import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --nl-heading-level-1-margin-block-start: var(--nl-heading-level-3-margin-block-start);
    --nl-heading-level-1-margin-block-end: var(--nl-heading-level-3-margin-block-end);
    --nl-heading-level-1-line-height: var(--nl-heading-level-3-line-height);
    --nl-heading-level-1-font-weight: var(--nl-heading-level-3-font-weight);
    --nl-heading-level-1-font-size: var(--nl-heading-level-3-font-size);
    --nl-heading-level-1-font-family: var(--nl-heading-level-3-font-family);
    --nl-heading-level-1-color: var(--nl-heading-level-3-color);

    --nl-heading-level-2-margin-block-start: var(--nl-heading-level-4-margin-block-start);
    --nl-heading-level-2-margin-block-end: var(--nl-heading-level-4-margin-block-end);
    --nl-heading-level-2-line-height: var(--nl-heading-level-4-line-height);
    --nl-heading-level-2-font-weight: var(--nl-heading-level-4-font-weight);
    --nl-heading-level-2-font-size: var(--nl-heading-level-4-font-size);
    --nl-heading-level-2-font-family: var(--nl-heading-level-4-font-family);
    --nl-heading-level-2-color: var(--nl-heading-level-4-color);
  }

  .wizard-validation-drawer__toggle--has-notification {
    position: relative;

    &::after {
      background-color: #f14848;
      block-size: var(--basis-space-inline-md);
      border-radius: var(--basis-border-radius-round);
      content: '';
      inline-size: var(--basis-space-inline-md);
      inset-block-start: var(--basis-space-inline-lg);
      inset-inline-start: var(--basis-space-inline-2xl);
      pointer-events: none;
      position: absolute;
    }
  }
`;
