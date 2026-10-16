import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --_clippy-table-of-content-highlighted: var(--clippy-table-of-content-highlighted, 0);

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

  .clippy-table-of-content__content {
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-row-xl);

    @container style(--_clippy-table-of-content-highlighted: 1) {
      background-color: var(--ma-table-of-contents-highlighted-background-color);
      padding-block-end: var(--ma-table-of-contents-highlighted-padding-block-end);
      padding-block-start: var(--ma-table-of-contents-highlighted-padding-block-start);
      padding-inline-end: var(--ma-table-of-contents-highlighted-padding-inline-end);
      padding-inline-start: var(--ma-table-of-contents-highlighted-padding-inline-start);
    }
  }
`;
