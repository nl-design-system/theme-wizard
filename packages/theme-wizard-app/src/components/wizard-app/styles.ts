import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    /* Clippy-page-layout */
    --clippy-page-layout-background-color: var(--basis-color-accent-1-bg-subtle);

    /* Clippy-combobox */
    --utrecht-listbox-option-hover-background-color: var(--basis-color-accent-1-bg-hover);

    /* Clippy-card */
    --clippy-card-background-color: var(--basis-color-default-bg-document);
    --clippy-card-border-color: var(--basis-color-default-border-subtle);
    --clippy-card-border-radius: var(--basis-border-radius-md);
    --clippy-card-border-width: var(--basis-border-width-sm);
    --clippy-card-color: var(--basis-color-default-color-document);
    --clippy-card-max-inline-size: 48rem;

    /* Clippy-card:hover */
    --clippy-card-hover-background-color: var(--basis-color-default-bg-hover);
    --clippy-card-hover-border-color: var(--clippy-card-border-color);

    /* Clippy-card:active */
    --clippy-card-active-background-color: var(--basis-color-default-bg-active);
    --clippy-card-active-border-color: var(--clippy-card-border-color);

    /* Clippy-card pre-header */
    --clippy-card-pre-header-column-gap: var(--basis-space-column-md);
    --clippy-card-pre-header-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-pre-header-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-pre-header-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-pre-header-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-pre-header-row-gap: var(--basis-space-row-md);

    /* Clippy-card header */
    --clippy-card-header-column-gap: var(--basis-space-column-md);
    --clippy-card-header-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-header-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-header-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-header-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-header-row-gap: var(--basis-space-row-md);
    --clippy-card-header-text-decoration: none;

    /* Clippy-card body */
    --clippy-card-body-column-gap: var(--basis-space-column-md);
    --clippy-card-body-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-body-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-body-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-body-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-body-row-gap: var(--basis-space-row-md);

    /* Clippy-card footer */
    --clippy-card-footer-column-gap: var(--basis-space-column-md);
    --clippy-card-footer-padding-block-end: var(--basis-space-block-lg);
    --clippy-card-footer-padding-block-start: var(--basis-space-block-lg);
    --clippy-card-footer-padding-inline-end: var(--basis-space-inline-xl);
    --clippy-card-footer-padding-inline-start: var(--basis-space-inline-xl);
    --clippy-card-footer-row-gap: var(--basis-space-row-md);

    font-family: var(--basis-text-font-family-default, inherit);
  }
`;
