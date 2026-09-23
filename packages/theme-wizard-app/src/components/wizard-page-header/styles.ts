import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .wizard-page-header__logo {
    padding-block: var(--wizard-layout-nav-padding-block);
    text-decoration: none;
  }
`;
