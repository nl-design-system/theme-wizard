import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import { css, unsafeCSS } from 'lit';

export default css`
  ${unsafeCSS(maTheme)}

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
    color: var(--basis-heading-color) !important;
    font-size: var(--basis-heading-font-size) !important;
  }
`;
