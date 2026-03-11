import { css } from 'lit';

export default css`
  .wizard-app__basis-tokens {
    display: grid;
    margin-block: 0;
    padding-inline-start: 0;
    row-gap: var(--basis-space-row-md);

    > li {
      list-style-type: none;
    }
  }

  .wizard-tokens-form__markdown {
    p {
      color: var(--basis-color-default-color-subtle);
      margin-block: 0;
    }
  }

  .wizard-tokens-form__section-links {
    border-block-start: var(--basis-border-width-sm) solid var(--basis-color-accent-1-border-subtle);
  }

  .wizard-tokens-form__section-link {
    --utrecht-link-color: var(--basis-color-accent-1-color-default);
    --utrecht-link-hover-color: var(--basis-color-accent-1-color-hover);
    --utrecht-link-text-decoration-color: var(--basis-color-transparent);
    --utrecht-button-border-radius: 0;
    --utrecht-button-padding-inline-start: 0;

    align-items: center;
    border-block-end: var(--basis-border-width-sm) solid var(--basis-color-accent-1-border-subtle);
    display: flex;
    font-size: var(--basis-text-font-size-md);
    font-weight: var(--basis-text-font-weight-bold);
    inline-size: 100%;
    justify-content: space-between;
    padding-block: var(--basis-space-block-2xl);
    padding-inline-end: var(--basis-space-inline-xl);

    @media (hover) {
      &:hover .wizard-tokens-form__section-link-icon {
        transform: translateX(var(--basis-space-inline-sm));
      }
    }
  }

  .wizard-tokens-form__section-link-icon {
    color: var(--basis-color-accent-1-color-subtle);
    transition: transform 100ms ease-out;
  }

  .wizard-form__field {
    --nl-heading-level-4-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-4-line-height: var(--basis-text-line-height-md);
    --nl-heading-level-4-margin-block-end: 0;
    --nl-heading-level-4-margin-block-start: 0;
  }

  .wizard-tokens-form__back-button {
    --utrecht-button-padding-inline-start: 0;
    --utrecht-button-padding-inline-end: 0;
    --utrecht-button-font-weight: var(--basis-text-font-weight-default);

    inline-size: fit-content;
  }
`;
