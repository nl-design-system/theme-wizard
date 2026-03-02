import { css } from 'lit';

export default css`
  .wizard-anchor-nav {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    row-gap: var(--basis-space-row-xl);
  }

  .wizard-anchor-nav__link {
    display: block;
    padding-block: var(--basis-space-block-sm);
  }
`;
