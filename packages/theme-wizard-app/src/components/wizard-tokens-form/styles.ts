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

  .wizard-tokens-form__section-links {
    border-block-start: 1px solid var(--basis-color-accent-1-border-subtle);
  }

  .wizard-tokens-form__section-link {
    --nl-link-color: var(--basis-color-accent-1-color-default);
    --nl-link-hover-color: var(--basis-color-accent-1-color-hover);
    --nl-link-text-decoration-color: var(--basis-color-transparent);

    border-block-end: 1px solid var(--basis-color-accent-1-border-subtle);
    display: flex;
    font-size: var(--basis-text-font-size-md);
    font-weight: var(--basis-text-font-weight-bold);
    justify-content: space-between;
    padding-block: var(--basis-space-block-2xl);
    padding-inline-end: var(--basis-space-inline-xl);
    vertical-align: middle;

    @media (hover) {
      .icon {
        transition: transform 0.1s ease-out;
      }

      &:hover .icon {
        transform: translateX(var(--basis-space-inline-sm));
      }
    }
  }

  .wizard-form__color-field {
    --nl-heading-level-4-font-size: var(--basis-text-font-size-md);
    --nl-heading-level-4-line-height: var(--basis-text-line-height-md);
    --nl-heading-level-4-margin-block-end: 0;
    --nl-heading-level-4-margin-block-start: 0;
    --nl-paragraph-margin-block-end: 0;
    --nl-paragraph-color: var(--basis-color-default-color-subtle);
  }
`;
