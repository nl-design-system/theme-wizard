import { css } from 'lit';

export default css`
  .wizard-styleguide__main {
    display: grid;
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-xl);
<<<<<<< HEAD
||||||| parent of e8a0f8a (prettier side nav)
    display: grid;
    row-gap: var(--basis-space-block-3xl);
=======
    display: grid;
>>>>>>> e8a0f8a (prettier side nav)
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
<<<<<<< HEAD
    border-inline-start: 4px solid transparent;
    color: var(--basis-color-accent-1-color-default);
    display: block;
    font-size: var(--basis-text-font-size-lg);
    font-weight: var(--basis-text-font-weight-bold);
    padding-block: var(--basis-space-block-xl);
    padding-inline: var(--basis-space-inline-2xl);
    text-decoration: none;
||||||| parent of e8a0f8a (prettier side nav)
    row-gap: var(--basis-space-block-2xl);
=======
    display: block;
    border-inline-start: 4px solid transparent;
    padding-inline: var(--basis-space-inline-2xl);
    padding-block: var(--basis-space-block-xl);
    text-decoration: none;
    font-weight: var(--basis-text-font-weight-bold);
    font-size: var(--basis-text-font-size-lg);
>>>>>>> e8a0f8a (prettier side nav)

    &:hover,
    &:focus-visible {
      background-color: var(--basis-color-accent-1-bg-hover);
      border-inline-start-color: var(--basis-color-accent-1-border-hover);
    }
  }
`;
