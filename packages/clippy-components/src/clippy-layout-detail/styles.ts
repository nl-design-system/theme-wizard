import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --_clippy-layout-detail-content-max-inline-size: var(
      --clippy-layout-detail-content-max-inline-size,
      var(--clippy-page-layout-content-max-inline-size, var(--basis-page-max-inline-size))
    );
    --_clippy-layout-detail-content-padding-inline-start: var(
      --clippy-layout-detail-content-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-layout-detail-content-padding-inline-end: var(
      --clippy-layout-detail-content-padding-inline-end,
      var(--basis-space-inline-xl)
    );
    --_clippy-layout-detail-column-gap: var(--clippy-layout-detail-column-gap, var(--basis-space-column-4xl));
    --_clippy-layout-detail-sidebar-inline-size: var(--clippy-layout-detail-sidebar-inline-size, 300px);
  }

  .clippy-layout-detail__content {
    box-sizing: border-box;
    max-inline-size: var(--_clippy-layout-detail-content-max-inline-size);
    padding-inline-end: var(--_clippy-layout-detail-content-padding-inline-end);
    padding-inline-start: var(--_clippy-layout-detail-content-padding-inline-start);
    margin-inline: auto;
    container-name: clippy-layout-detail;
    container-type: inline-size;
  }

  .clippy-layout-detail__grid {
    column-gap: var(--_clippy-layout-detail-column-gap);
    display: grid;
    grid-template-rows: auto auto auto auto 1fr;
    grid-template-areas:
      'sidebar'
      'breadcrumb'
      'header'
      'aside'
      'body';

    @container clippy-layout-detail (inline-size >= 1140px) {
      grid-template-areas: 'sidebar breadcrumb' 'sidebar header' 'sidebar aside' 'sidebar body';
      grid-template-columns: var(--_clippy-layout-detail-sidebar-inline-size) 1fr;
    }

    @container clippy-layout-detail (inline-size >= 1280px) {
      grid-template-areas: 'sidebar breadcrumb breadcrumb' 'sidebar header aside' 'sidebar body aside';
      grid-template-columns: var(--_clippy-layout-detail-sidebar-inline-size) 1fr var(
          --_clippy-layout-detail-sidebar-inline-size
        );
      grid-template-rows: auto auto 1fr;
    }
  }

  .clippy-layout-detail__sidebar {
    grid-area: sidebar;
  }

  .clippy-layout-detail__breadcrumb {
    grid-area: breadcrumb;
  }

  .clippy-layout-detail__wrap-main {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    grid-row: header / body;
    outline: 5px solid hotpink;

    @container clippy-layout-detail (inline-size >= 1280px) {
      grid-column: header / aside;
    }
  }

  .test-header {
    background-color: red;
    grid-area: header;
  }
  .test-body {
    background-color: blue;
    grid-area: body;
  }
  .test-aside {
    background-color: green;
    grid-area: aside;
  }
`;
