import { css } from 'lit';

export default css`
  :host:not([hidden]) {
    display: block;
  }

  .wizard-container {
    max-inline-size: 100%;
    padding-inline: var(--basis-space-inline-xl);
  }

  .wizard-container--page {
    inline-size: var(--basis-page-max-inline-size);
  }

  .wizard-container--sm {
    inline-size: 20rem;
  }

  .wizard-container--md {
    inline-size: 33rem;
  }

  .wizard-container--lg {
    inline-size: 44rem;
  }

  .wizard-container--xl {
    inline-size: 55rem;
  }

  .wizard-container--2xl {
    inline-size: 72rem;
  }

  .wizard-container--3xl {
    inline-size: 96rem;
  }
`;
