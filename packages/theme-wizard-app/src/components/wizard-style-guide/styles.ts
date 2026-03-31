import { css } from 'lit';

export default css`
  .wizard-style-guide {
    --utrecht-table-caption-text-align: start;
    --utrecht-table-caption-font-size: var(--basis-text-font-size-xl);
    --nl-code-background-color: var(--basis-color-transparent);
    --nl-code-font-family: var(--basis-text-font-family-default);
    --nl-data-badge-background-color: var(--basis-color-transparent);
    --nl-data-badge-font-weight: var(--basis-text-font-weight-default);
    --nl-data-badge-color: var(--basis-color-default-color-document);

    display: grid;
    row-gap: var(--basis-space-row-4xl);
  }

  utrecht-table-cell {
    vertical-align: middle;
  }

  .nl-data-badge {
    white-space: nowrap;
  }

  .utrecht-link-button--html-button {
    white-space: nowrap;
  }

  clippy-html-image {
    display: block;
    max-inline-size: 32rem;
    overflow: clip;
  }
`;
