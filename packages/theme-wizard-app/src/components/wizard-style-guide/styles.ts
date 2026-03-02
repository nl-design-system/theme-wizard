import { css } from 'lit';

export default css`
  .guide {
    display: grid;
    row-gap: var(--basis-space-row-4xl);
  }

  utrecht-table-cell {
    vertical-align: middle;
  }

  clippy-html-image {
    display: block;
    max-inline-size: 32rem;
    overflow: clip;
  }
`;
