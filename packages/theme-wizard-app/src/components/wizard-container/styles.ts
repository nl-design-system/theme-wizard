import { css } from 'lit';

export default css`
  :host:not([hidden]) {
    display: block;
  }

  .wizard-container {
    box-sizing: border-box;
    display: block;
    inline-size: 100%;
  }

  .wizard-container--page {
    max-inline-size: var(--basis-page-max-max-inline-size);
    padding-inline: var(--basis-space-inline-xl);
  }

  .wizard-container--sm {
    max-inline-size: 20rem;
  }

  .wizard-container--md {
    max-inline-size: 33rem;
  }

  .wizard-container--lg {
    max-inline-size: 44rem;
  }

  .wizard-container--xl {
    max-inline-size: 55rem;
  }

  .wizard-container--2xl {
    max-inline-size: 72rem;
  }

  .wizard-container--3xl {
    max-inline-size: 96rem;
  }
`;
