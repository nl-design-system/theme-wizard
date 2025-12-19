import { css } from 'lit';

export default css`
  .wizard-app__sidebar {
    --utrecht-heading-2-font-size: var(--basis-text-font-size-lg);
    --utrecht-heading-2-margin-block-end: var(--basis-space-block-lg);
    --utrecht-heading-3-font-size: var(--basis-text-font-size-md);

    display: grid;
    row-gap: var(--basis-space-block-3xl);

    section:last-of-type {
      margin-block-start: auto;
    }

    utrecht-heading-2 {
      display: block;
      margin-block-end: var(--basis-space-block-md);
    }
  }

  .wizard-app__basis-colors {
    display: grid;
    margin-block: 0;
    padding-inline-start: 0;
    row-gap: var(--basis-space-block-md);

    > li {
      list-style-type: none;
    }
  }

  .wizard-app__root-token-field {
    max-block-size: 50vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;

    @media (pointer: fine) {
      scrollbar-color: var(--basis-color-accent-1-color-default) transparent;
      scrollbar-width: thin;
    }
  }

  [type='reset'] {
    margin-block: var(--basis-space-block-md);
    min-block-size: auto;
    padding-block: 0;
    padding-inline: 0;
  }

  .wizard-app__nav {
    display: grid;
    justify-content: end;
  }
`;
