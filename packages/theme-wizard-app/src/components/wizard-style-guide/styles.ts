import { css } from 'lit';

export default css`
  .wizard-styleguide__main {
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-xl);
    display: grid;
    row-gap: var(--basis-space-row-5xl);
  }

  section {
    display: grid;
    row-gap: var(--basis-space-row-4xl);
  }

  .wizard-styleguide__nav {
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-row-md);
  }

  .wizard-styleguide__nav-item {
    display: block;
    border-inline-start: 4px solid transparent;
    padding-inline: var(--basis-space-inline-2xl);
    padding-block: var(--basis-space-block-xl);
    text-decoration: none;
    font-weight: var(--basis-text-font-weight-bold);
    font-size: var(--basis-text-font-size-lg);

    &:hover,
    &:focus-visible {
      background-color: var(--basis-color-accent-1-bg-hover);
      border-inline-start-color: var(--basis-color-accent-1-border-hover);
    }
  }
`;
