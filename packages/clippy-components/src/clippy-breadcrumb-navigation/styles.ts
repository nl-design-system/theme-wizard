import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  /**
   * Overrides for utrecht-breadcrumb-nav to stretch items to the minimum tap size
   */
  .clippy-breadcrumb-navigation__item,
  .clippy-breadcrumb-navigation__link,
  .clippy-breadcrumb-navigation__separator {
    display: flex;
  }

  .clippy-breadcrumb-navigation__item {
    align-items: stretch;
    block-size: auto;
  }

  .clippy-breadcrumb-navigation__link,
  .clippy-breadcrumb-navigation__separator {
    align-items: center;
  }

  .clippy-breadcrumb-navigation__separator {
    --clippy-icon-size: var(--utrecht-breadcrumb-nav-separator-icon-size);
  }
`;
