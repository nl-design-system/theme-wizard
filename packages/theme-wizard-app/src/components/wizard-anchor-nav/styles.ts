import { css } from 'lit';

export default css`
  .wizard-anchor-nav {
    border-inline-start: 1px solid var(--basis-color-default-border-subtle);
    display: grid;
    list-style: none;
    margin-block: 0;
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-column-3xl);
    row-gap: var(--basis-space-row-xl);
  }

  .wizard-anchor-nav__link {
    display: block;
    padding-block: var(--basis-space-block-sm);
  }
`;
