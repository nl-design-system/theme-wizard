import { css } from 'lit';

export default css`
  .wizard-anchor-nav {
    border-left: 1px solid var(--basis-color-default-border-subtle);
    display: grid;
    list-style: none;
    margin: 0;
    padding: 0;
    padding-block: var(--basis-space-block-xl);
    padding-inline-start: var(--basis-space-column-3xl);
    row-gap: var(--basis-space-row-xl);
  }

  .wizard-anchor-nav__link {
    display: block;
    padding-block: var(--basis-space-block-sm);
  }
`;
