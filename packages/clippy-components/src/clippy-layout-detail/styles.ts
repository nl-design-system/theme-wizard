import { css } from 'lit';

/**
 * This component extends the styling from `clippy-layout-overview`.
 */
export default css`
  .clippy-layout__grid {
    @container clippy-layout (inline-size >= 80rem) {
      grid-template-areas: 'sidebar breadcrumb breadcrumb' 'sidebar header aside' 'sidebar body aside';
      grid-template-columns: var(--_clippy-layout-sidebar-inline-size) 1fr var(--_clippy-layout-sidebar-inline-size);
      grid-template-rows: auto auto 1fr;
    }
  }
`;
