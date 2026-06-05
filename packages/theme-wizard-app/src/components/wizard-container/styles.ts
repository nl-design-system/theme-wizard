import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    box-sizing: border-box;
  }

  :host([size='page' i]) {
    max-inline-size: var(--basis-page-max-inline-size);
    padding-inline: var(--basis-space-inline-xl);
  }

  :host([size='sm' i]) {
    max-inline-size: 20rem;
  }

  :host([size='md' i]) {
    max-inline-size: 33rem;
  }

  :host([size='lg' i]) {
    max-inline-size: 44rem;
  }

  :host([size='xl' i]) {
    max-inline-size: 55rem;
  }

  :host([size='2xl' i]) {
    max-inline-size: 72rem;
  }

  :host([size='3xl' i]) {
    max-inline-size: 96rem;
  }
`;
