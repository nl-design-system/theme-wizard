import { css } from 'lit';

export default css`
  .wizard-styleguide__main {
    display: grid;
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-xl);
    row-gap: var(--basis-space-row-5xl);
  }

  .wizard-styleguide__nav {
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-row-md);
  }

  .wizard-styleguide__nav-item {
    border-inline-start: 4px solid transparent;
    color: var(--basis-color-accent-1-color-default);
    display: block;
    font-size: var(--basis-text-font-size-lg);
    font-weight: var(--basis-text-font-weight-bold);
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-2xl);
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background-color: var(--basis-color-accent-1-bg-hover);
      border-inline-start-color: var(--basis-color-accent-1-border-hover);
    }
  }
`;
