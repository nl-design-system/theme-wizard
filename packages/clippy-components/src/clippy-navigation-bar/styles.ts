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
    --_clippy-navigation-bar-padding-block-start: var(
      --ma-page-header-content-padding-block-start,
      var(--basis-space-block-md)
    );
    --_clippy-navigation-bar-padding-block-end: var(
      --ma-page-header-content-padding-block-end,
      var(--basis-space-block-md)
    );
  }

  .clippy-navigation-bar {
    min-block-size: calc(
      var(--basis-pointer-target-min-block-size) + var(--_clippy-navigation-bar-padding-block-start) +
        var(--_clippy-navigation-bar-padding-block-end)
    );
  }

  .clippy-navigation-bar__list-item {
    display: flex;
  }

  .clippy-navigation-bar__item {
    align-items: center;
  }
`;
