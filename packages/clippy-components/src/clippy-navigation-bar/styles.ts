import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --ma-navigation-bar-content-max-inline-size: var(
      --clippy-navigation-bar-content-max-inline-size,
      var(--clippy-page-layout-content-max-inline-size, var(--basis-page-max-inline-size))
    );
  }

  .clippy-navigation-bar__list-item {
    display: flex;
  }

  .clippy-navigation-bar__item {
    align-items: center;
  }
`;
