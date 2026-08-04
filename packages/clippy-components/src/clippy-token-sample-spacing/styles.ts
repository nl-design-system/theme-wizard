import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
    inline-size: fit-content;
  }

  :host {
    --_clippy-token-sample-spacing-value: var(--clippy-token-sample-spacing-value, 1rem);

    border-width: 1px;
    border-style: solid;
    border-color: var(--basis-color-default-border-default);

    &::before,
    &::after {
      background-color: red;
      content: '';
    }
  }

  :host([concept='inline']) {
    grid-template-columns: var(--_clippy-token-sample-spacing-value) auto var(--_clippy-token-sample-spacing-value);
    grid-template-areas: 'start label end';
  }

  .clippy-token-sample-spacing__label {
    grid-area: label;
  }
`;
