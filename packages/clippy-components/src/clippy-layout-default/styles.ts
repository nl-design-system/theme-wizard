import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-layout-focus-content-max-inline-size: var(--clippy-layout-focus-content-max-inline-size, 45rem);
    --_clippy-layout-focus-content-padding-inline-start: var(
      --clippy-layout-focus-content-padding-inline-start,
      var(--clippy-page-layout-content-inline-padding, var(--basis-space-inline-xl))
    );
    --_clippy-layout-focus-content-padding-inline-end: var(
      --clippy-layout-focus-content-padding-inline-end,
      var(--clippy-page-layout-content-inline-padding, var(--basis-space-inline-xl))
    );
    --_clippy-layout-focus-content-padding-block-start: var(
      --clippy-layout-focus-content-padding-block-start,
      var(--clippy-page-layout-content-block-padding, var(--basis-space-block-3xl))
    );
    --_clippy-layout-focus-content-padding-block-end: var(
      --clippy-layout-focus-content-padding-block-end,
      var(--clippy-page-layout-content-block-padding, var(--basis-space-block-3xl))
    );
    --_clippy-layout-focus-row-gap: var(--clippy-layout-focus-row-gap, var(--basis-space-row-xl));

    container-name: clippy-layout;
    container-type: inline-size;
  }

  .clippy-layout-focus__content {
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
      'breadcrumb'
      'header'
      'aside'
      'body';
    grid-template-rows: auto auto auto 1fr;
    margin-inline: auto;
    max-inline-size: var(--_clippy-layout-focus-content-max-inline-size);
    padding-block-end: var(--_clippy-layout-focus-content-padding-block-end);
    padding-block-start: var(--_clippy-layout-focus-content-padding-block-start);
    padding-inline-end: var(--_clippy-layout-focus-content-padding-inline-end);
    padding-inline-start: var(--_clippy-layout-focus-content-padding-inline-start);
  }

  .clippy-layout-focus__breadcrumb {
    grid-area: breadcrumb;
    margin-block-end: var(--_clippy-layout-focus-row-gap);
  }

  .clippy-layout-focus__wrap-main {
    display: grid;
    grid-column-end: aside;
    grid-column-start: header;
    grid-row-end: body;
    grid-row-start: header;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
  }
`;
