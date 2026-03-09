import { css } from 'lit';

export default css`
  :host:not([hidden]) {
    display: block;
  }

  .wizard-container {
    margin-inline: auto;
    padding-inline: var(--basis-space-inline-xl);
  }

  .wizard-container--page {
    max-inline-size: var(--basis-page-max-inline-size);
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
`;
