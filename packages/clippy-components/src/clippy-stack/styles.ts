import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    --_clippy-stack-size: var(--basis-space-row-md);

    flex-direction: column;
    gap: var(--clippy-stack-size, var(--_clippy-stack-size));
  }

  :host([size='none' i]) {
    --_clippy-stack-size: 0;
  }

  :host([size='2xs' i]) {
    --_clippy-stack-size: var(--basis-space-row-2xs);
  }

  :host([size='xs' i]) {
    --_clippy-stack-size: var(--basis-space-row-xs);
  }

  :host([size='sm' i]) {
    --_clippy-stack-size: var(--basis-space-row-sm);
  }

  :host([size='md' i]) {
    --_clippy-stack-size: var(--basis-space-row-md);
  }

  :host([size='lg' i]) {
    --_clippy-stack-size: var(--basis-space-row-lg);
  }

  :host([size='xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-xl);
  }

  :host([size='2xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-2xl);
  }

  :host([size='3xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-3xl);
  }

  :host([size='4xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-4xl);
  }

  :host([size='5xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-5xl);
  }

  :host([size='6xl' i]) {
    --_clippy-stack-size: var(--basis-space-row-6xl);
  }
`;
