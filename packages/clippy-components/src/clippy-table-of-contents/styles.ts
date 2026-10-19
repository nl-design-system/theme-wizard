import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    /* Override semantic heading level 2 with level 4 styles */
    --nl-heading-level-2-margin-block-start: var(--nl-heading-level-4-margin-block-start);
    --nl-heading-level-2-margin-block-end: var(--nl-heading-level-4-margin-block-end);
    --nl-heading-level-2-line-height: var(--nl-heading-level-4-line-height);
    --nl-heading-level-2-font-weight: var(--nl-heading-level-4-font-weight);
    --nl-heading-level-2-font-size: var(--nl-heading-level-4-font-size);
    --nl-heading-level-2-font-family: var(--nl-heading-level-4-font-family);
    --nl-heading-level-2-color: var(--nl-heading-level-4-color);

    container-name: table-of-contents;
    container-type: inline-size;
  }

  .clippy-table-of-contents__content {
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-row-xl);
  }
`;
