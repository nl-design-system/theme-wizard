import { css } from 'lit';

export default css`
  .utrecht-form-field__description {
    --utrecht-form-field-description-margin-block-end: var(--basis-space-row-2xl);
    --utrecht-form-field-description-margin-block-start: var(--basis-space-row-sm);

    color: var(--basis-color-default-color-subtle);
  }

  .utrecht-form-field__error-message {
    margin-block: var(--basis-space-block-md);
  }

  .wizard-scraper__loaders {
    display: grid;
  }

  wizard-scraper-loader {
    grid-area: 1 / 1;
    opacity: 0%;
    transition: opacity 500ms ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    &.wizard-scraper__loader--active {
      opacity: 100%;
    }
  }
`;
