import { css } from 'lit';

export default css`
  .wizard-page-nav {
    display: flex;
    justify-content: center;
    list-style: none;
    margin-block: 0;
  }

  .wizard-page-nav__link {
    --nl-link-color: var(--basis-color-accent-1-inverse-color-default);
    --nl-link-text-decoration-line: none;

    align-content: center;
    border-block-start-style: solid;
    border-block-start-width: var(--basis-border-width-lg);
    border-color: var(--basis-color-transparent);
    box-sizing: border-box;
    display: block;
    font-weight: var(--basis-text-font-weight-bold);
    min-block-size: 100%;
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-lg);

    &:hover {
      background-color: var(--ma-navigation-bar-item-hover-background-color);
      border-block-start-color: var(--ma-navigation-bar-item-hover-border-color);
      color: var(--ma-navigation-bar-item-hover-color);
    }

    &[aria-current='page'] {
      background-color: var(--ma-navigation-bar-item-active-background-color);
      border-block-start-color: var(--ma-navigation-bar-item-active-border-color);
    }
  }
`;
