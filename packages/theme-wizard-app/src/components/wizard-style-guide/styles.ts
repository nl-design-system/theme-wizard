import { css } from 'lit';

export default css`
  section {
    display: grid;
    row-gap: var(--basis-space-row-4xl);
  }

  utrecht-table-cell {
    vertical-align: middle;
  }

  .wizard-token-unused,
  tr[aria-describedby*='unused-warning'] utrecht-code {
    text-decoration-color: var(--basis-color-warning-border-default);
    text-decoration-line: underline;
    text-decoration-style: wavy;
  }

  clippy-html-image {
    display: block;
    max-inline-size: 24rem;
    overflow: clip;
  }
`;
