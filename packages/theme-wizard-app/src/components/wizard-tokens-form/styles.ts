import { css } from 'lit';

export default css`
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
`;
