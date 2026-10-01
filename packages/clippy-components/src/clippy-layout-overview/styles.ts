import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-layout-content-max-inline-size: var(
      --clippy-layout-content-max-inline-size,
      var(--clippy-page-layout-content-max-inline-size, var(--basis-page-max-inline-size))
    );
    --_clippy-layout-content-padding-inline-start: var(
      --clippy-layout-content-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-layout-content-padding-inline-end: var(
      --clippy-layout-content-padding-inline-end,
      var(--basis-space-inline-xl)
    );
    --_clippy-layout-content-padding-block-start: var(
      --clippy-layout-content-padding-block-start,
      var(--basis-space-block-3xl)
    );
    --_clippy-layout-content-padding-block-end: var(
      --clippy-layout-content-padding-block-end,
      var(--basis-space-block-3xl)
    );
    --_clippy-layout-column-gap: var(--clippy-layout-column-gap, var(--basis-space-column-4xl));
    --_clippy-layout-row-gap: var(--clippy-layout-row-gap, var(--basis-space-row-xl));
    --_clippy-layout-sidebar-inline-size: var(--clippy-layout-sidebar-inline-size, 300px);

    container-name: clippy-layout;
    container-type: inline-size;
  }

  .clippy-layout__content {
    box-sizing: border-box;
    margin-inline: auto;
    max-inline-size: var(--_clippy-layout-content-max-inline-size);
    padding-block-end: var(--_clippy-layout-content-padding-block-end);
    padding-block-start: var(--_clippy-layout-content-padding-block-start);
    padding-inline-end: var(--_clippy-layout-content-padding-inline-end);
    padding-inline-start: var(--_clippy-layout-content-padding-inline-start);
  }

  .clippy-layout__grid {
    column-gap: var(--_clippy-layout-column-gap);
    display: grid;
    grid-template-areas:
      'sidebar'
      'breadcrumb'
      'header'
      'aside'
      'body';
    grid-template-rows: auto auto auto auto 1fr;

    @container clippy-layout (inline-size >= 72rem) {
      grid-template-areas: 'sidebar breadcrumb' 'sidebar header' 'sidebar aside' 'sidebar body';
      grid-template-columns: var(--_clippy-layout-sidebar-inline-size) 1fr;
      grid-template-rows: auto auto auto 1fr;
    }
  }

  .clippy-layout__sidebar {
    display: none;
    grid-area: sidebar;

    @container clippy-layout (inline-size >= 72rem) {
      &:not([hidden]) {
        display: block;
      }
    }
  }

  .clippy-layout__breadcrumb {
    grid-area: breadcrumb;
    margin-block-end: var(--_clippy-layout-row-gap);
  }

  .clippy-layout__wrap-main {
    display: grid;
    grid-column-end: aside;
    grid-column-start: header;
    grid-row-end: body;
    grid-row-start: header;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
  }
`;
