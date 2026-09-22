import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --ma-page-header-content-max-inline-size: var(
      --clippy-page-header-content-max-inline-size,
      var(--clippy-page-layout-content-max-inline-size, var(--basis-page-max-inline-size))
    );
  }

  .clippy-page-header {
    background-color: var(--ma-page-header-background-color);
    container-name: clippy-page-header;
    container-type: inline-size;
    inline-size: 100%;
    position: relative;
    z-index: 0;
  }

  .clippy-page-header__top {
  }

  .clippy-page-header__bottom {
    background-color: var(--ma-page-header-border-color);
    min-block-size: var(--ma-page-header-border-block-end-width);
  }

  .clippy-page-header__content {
    box-sizing: border-box;
    display: flex;
    margin-inline: auto;
    max-inline-size: var(--ma-page-header-content-max-inline-size);
    padding-inline-end: var(--ma-page-header-content-padding-inline-end);
    padding-inline-start: var(--ma-page-header-content-padding-inline-start);

    :where(.clippy-page-header__top) > & {
      padding-block-end: var(--ma-page-header-content-padding-block-end);
      padding-block-start: var(--ma-page-header-content-padding-block-start);
    }
  }

  .clippy-page-header__group {
    display: flex;
    flex: 1;
  }

  .clippy-page-header__group--start {
    justify-content: start;
  }

  .clippy-page-header__group--center {
    justify-content: center;
  }

  .clippy-page-header__group--end {
    justify-content: end;
  }

  .clippy-page-header__navigation {
    display: none;
  }

  @container clippy-page-header (width < 20rem) {
    .clippy-page-header__content {
      flex-direction: column;
    }
  }

  @container clippy-page-header (width >= 48rem) {
    .clippy-page-header__content {
      border-block-end-style: none;
      padding-block-end: var(--ma-page-header-content-large-vw-padding-block-end);
      padding-block-start: var(--ma-page-header-content-large-vw-padding-block-start);
      padding-inline-end: var(--ma-page-header-content-large-vw-padding-inline-end);
      padding-inline-start: var(--ma-page-header-content-large-vw-padding-inline-start);
    }

    .clippy-page-header__group--start {
      display: none;
    }

    .clippy-page-header__navigation {
      display: unset;
    }
  }
`;
