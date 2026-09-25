import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .wizard-page-header__logo {
    text-decoration: none;
  }
`;
