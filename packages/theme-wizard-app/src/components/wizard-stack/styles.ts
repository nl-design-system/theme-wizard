import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    flex-direction: column;
  }

  :host([size='none' i]) {
    gap: 0;
  }

  :host([size='2xs' i]) {
    gap: var(--basis-space-row-2xs);
  }

  :host([size='xs' i]) {
    gap: var(--basis-space-row-xs);
  }

  :host([size='sm' i]) {
    gap: var(--basis-space-row-sm);
  }

  :host([size='md' i]) {
    gap: var(--basis-space-row-md);
  }

  :host([size='lg' i]) {
    gap: var(--basis-space-row-lg);
  }

  :host([size='xl' i]) {
    gap: var(--basis-space-row-xl);
  }

  :host([size='2xl' i]) {
    gap: var(--basis-space-row-2xl);
  }

  :host([size='3xl' i]) {
    gap: var(--basis-space-row-3xl);
  }

  :host([size='4xl' i]) {
    gap: var(--basis-space-row-4xl);
  }

  :host([size='5xl' i]) {
    gap: var(--basis-space-row-5xl);
  }

  :host([size='6xl' i]) {
    gap: var(--basis-space-row-6xl);
  }
`;
