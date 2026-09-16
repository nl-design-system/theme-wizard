import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
  }

  :host {
    --_clippy-layout-max-inline-size: var(--clippy-layout-max-inline-size, 90rem);
    --_clippy-layout-body-max-inline-size: var(
      --clippy-layout-body-max-inline-size,
      var(--_clippy-layout-max-inline-size)
    );
    --_clippy-layout-sidebar-inline-size: var(--clippy-layout-sidebar-inline-size, 20rem);

    /* Whitespace */
    --_clippy-layout-column-gap: var(--clippy-layout-column-gap, var(--basis-space-column-4xl));

    container-name: clippy-layout;
    container-type: inline-size;
    grid-template-rows: auto 1fr auto;
    min-block-size: 100vh;
  }

  .clippy-layout__masthead {
    outline: 1px solid green;
  }

  .clippy-layout__body {
    outline: 1px solid red;
    inline-size: 100%;
    max-inline-size: var(--_clippy-layout-body-max-inline-size);
    margin-inline: auto;
    display: grid;
    column-gap: var(--_clippy-layout-column-gap);

    @container clippy-layout (inline-size >= 71.25rem) {
      grid-template-columns: var(--_clippy-layout-sidebar-inline-size) 1fr;
    }
  }

  .clippy-layout__sidebar {
    outline: 1px solid blue;
  }

  .clippy-layout__main {
    outline: 1px solid purple;
    display: grid;
    grid-template-areas: 'breadcrumb-navigation' 'header' 'anchor-navigation' 'body';
    grid-template-rows: auto auto auto 1fr;

    @container clippy-layout (inline-size >= 80rem) {
      grid-template-areas: 'breadcrumb-navigation breadcrumb-navigation' 'header anchor-navigation' 'body anchor-navigation';
      grid-template-columns: 1fr var(--_clippy-layout-sidebar-inline-size);
    }
  }

  .clippy-layout__footer {
    outline: 1px solid blue;
  }
`;
