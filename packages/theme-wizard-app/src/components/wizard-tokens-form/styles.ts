import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    --wizard-scroll-container-max-size: none;

    grid-template-rows: var(--wizard-layout-body-template-rows, none);
    row-gap: var(--basis-space-row-lg);

    @media (height >= 40rem) and (orientation: landscape) {
      /* TODO: get page nav block size from parent */
      max-block-size: calc(
        100svb - var(--wizard-page-nav-block-size, 3rem) - var(
            --wizard-layout-body-padding-block,
            var(--basis-space-block-xl)
          ) *
          2
      );
    }
  }

  wizard-scroll-container {
    @media (height < 40rem) and (orientation: landscape) {
      overflow: visible;
    }
  }

  .wizard-tokens-form__header {
    align-self: center;
  }

  .wizard-tokens-form__markdown {
    p {
      color: var(--basis-color-default-color-subtle);
      margin-block: 0;
    }
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

  .wizard-tokens-form__input-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    row-gap: var(--basis-space-block-4xl);
    column-gap: var(--basis-space-block-4xl);
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
