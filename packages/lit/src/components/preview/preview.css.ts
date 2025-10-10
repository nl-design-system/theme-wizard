import { css } from 'lit';

export default css`
  :host {
    display: block;
    inline-size: 100%;
  }

  /* Apply typography to content */
  span,
  p,
  li,
  a,
  button,
  input,
  textarea {
    font-family: var(--basis-text-font-family-default) !important;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--theme-heading-font-family, var(--basis-heading-font-family)) !important;
  }
`;
