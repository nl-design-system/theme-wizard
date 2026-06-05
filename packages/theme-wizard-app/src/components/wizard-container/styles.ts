import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    box-sizing: border-box;
  }

  :host([size='page']) {
    max-inline-size: var(--basis-page-max-inline-size);
    padding-inline: var(--basis-space-inline-xl);
  }

  :host([size='sm']) {
    max-inline-size: 20rem;
  }

  :host([size='md']) {
    max-inline-size: 33rem;
  }

  :host([size='lg']) {
    max-inline-size: 44rem;
  }

  :host([size='xl']) {
    max-inline-size: 55rem;
  }

  :host([size='2xl']) {
    max-inline-size: 72rem;
  }

  :host([size='3xl']) {
    max-inline-size: 96rem;
  }
`;
