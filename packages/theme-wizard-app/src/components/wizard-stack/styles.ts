import { css } from 'lit';

export default css`
  :host:not([hidden]) {
    display: block;
  }

  .wizard-stack {
    display: flex;
    flex-direction: column;
  }

  .wizard-stack--none {
    gap: 0;
  }

  .wizard-stack--2xs {
    gap: var(--basis-space-row-2xs);
  }

  .wizard-stack--xs {
    gap: var(--basis-space-row-xs);
  }

  .wizard-stack--sm {
    gap: var(--basis-space-row-sm);
  }

  .wizard-stack--md {
    gap: var(--basis-space-row-md);
  }

  .wizard-stack--lg {
    gap: var(--basis-space-row-lg);
  }

  .wizard-stack--xl {
    gap: var(--basis-space-row-xl);
  }

  .wizard-stack--2xl {
    gap: var(--basis-space-row-2xl);
  }

  .wizard-stack--3xl {
    gap: var(--basis-space-row-3xl);
  }

  .wizard-stack--4xl {
    gap: var(--basis-space-row-4xl);
  }

  .wizard-stack--5xl {
    gap: var(--basis-space-row-5xl);
  }

  .wizard-stack--6xl {
    gap: var(--basis-space-row-6xl);
  }
`;
