import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_wizard-page-footer-content-max-inline-size: var(
      --clippy-page-layout-content-max-inline-size,
      var(--basis-page-max-inline-size)
    );
    --_wizard-page-footer-content-padding-inline-start: var(--basis-space-inline-xl);
    --_wizard-page-footer-content-padding-inline-end: var(--basis-space-inline-xl);
    --_wizard-page-footer-content-padding-block-start: var(--basis-space-block-5xl);
    --_wizard-page-footer-content-padding-block-end: var(--basis-space-block-6xl);
    --_wizard-page-footer-color: var(--basis-color-accent-1-inverse-color-default);
    --_wizard-page-footer-background-color: var(--basis-color-accent-1-inverse-bg-default);

    background-color: var(--_wizard-page-footer-background-color);
    color: var(--_wizard-page-footer-color);

    @media (forced-colors: active) {
      border-block-start: var(--basis-border-width-sm) solid;
    }

    :any-link {
      --nl-link-text-decoration-color: var(--_wizard-page-footer-color);

      color: var(--_wizard-page-footer-color);
    }
  }

  .wizard-page-footer__content {
    align-items: start;
    box-sizing: border-box;
    column-gap: var(--basis-space-column-4xl);
    display: grid;
    margin-inline: auto;
    max-inline-size: var(--_wizard-page-footer-content-max-inline-size);
    padding-block-end: var(--_wizard-page-footer-content-padding-block-end);
    padding-block-start: var(--_wizard-page-footer-content-padding-block-start);
    padding-inline-end: var(--_wizard-page-footer-content-padding-inline-end);
    padding-inline-start: var(--_wizard-page-footer-content-padding-inline-start);
    row-gap: var(--basis-space-row-2xl);

    @container (inline-size > 44rem) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @container (inline-size > 86rem) {
      column-gap: var(--basis-space-column-5xl);
      grid-template-columns: repeat(auto-fit, fit-content);
    }
  }

  .wizard-page-footer__about {
    text-wrap: balance;

    > p {
      color: var(--_wizard-page-footer-color);
    }
  }

  .wizard-page-footer__nav {
    display: grid;
    row-gap: var(--basis-space-row-lg);
  }

  .wizard-page-footer__nav-link {
    display: block;
  }
`;
