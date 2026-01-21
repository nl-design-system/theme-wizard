import { css } from 'lit';

export default css`
  :host {
    /* Container */
    --denhaag-case-card-border-radius: var(--todo-case-card-border-radius);
    --denhaag-case-card-color: var(--todo-case-card-color);
    --denhaag-case-card-height: var(--denhaag-case-card-min-block-size, 240px);
    --denhaag-case-card-min-block-size: var(--todo-case-card-min-block-size);
    --denhaag-case-card-min-inline-size: var(--todo-case-card-min-inline-size);
    --denhaag-case-card-padding-block: var(--todo-case-card-padding-block);
    --denhaag-case-card-padding-block-start: var(--basis-space-block-2xl);
    --denhaag-case-card-padding-inline: var(--todo-case-card-padding-inline);
    --denhaag-case-card-row-gap: var(--todo-case-card-row-gap);

    /* Border (custom mapping to base tokens) */
    --denhaag-case-card-border-width: var(--basis-border-width-sm);
    --denhaag-case-card-border-color: var(--basis-color-default-border-subtle);

    /* Icon */
    --denhaag-case-card-icon-size: var(--todo-case-card-icon-size);
    --denhaag-case-card-icon-color: var(--todo-case-card-icon-color);

    /* Heading */
    --denhaag-case-card-title-color: var(--todo-case-card-heading-color);
    --denhaag-case-card-title-font-family: var(--todo-case-card-heading-font-family);
    --denhaag-case-card-title-font-size: var(--todo-case-card-heading-font-size);
    --denhaag-case-card-title-font-weight: var(--basis-heading-font-weight);
    --denhaag-case-card-title-line-height: var(--todo-case-card-heading-line-height);

    /* Subtitle (custom mapping to base tokens) */
    --denhaag-case-card-subtitle-color: var(--basis-color-default-color-subtle);
    --denhaag-case-card-subtitle-font-family: var(--basis-text-font-family-default);
    --denhaag-case-card-subtitle-font-size: var(--basis-text-font-size-md);
    --denhaag-case-card-subtitle-font-weight: var(--basis-text-font-weight-default);
    --denhaag-case-card-subtitle-line-height: var(--basis-text-line-height-md);
    --denhaag-case-card-subtitle-margin-block-start: var(--basis-space-block-sm);

    /* Context & action (custom mapping to base tokens) */
    --denhaag-case-card-action-color: var(--basis-color-action-2-color-default);
    --denhaag-case-card-context-color: var(--basis-color-default-color-subtle);

    /* Wrapper */
    --denhaag-case-card-background-background-color: var(--basis-color-action-2-bg-default);
    --denhaag-case-card-background-color: var(--basis-color-action-2-bg-active);
    --denhaag-case-card-wrapper-flex-direction: column;
    --denhaag-case-card-wrapper-padding-block-end: var(--basis-space-block-2xl);
    --denhaag-case-card-wrapper-padding-block-start: var(--basis-space-block-2xl);
    --denhaag-case-card-wrapper-padding-inline-end: var(--basis-space-inline-3xl);
    --denhaag-case-card-wrapper-padding-inline-start: var(--basis-space-inline-3xl);
    --denhaag-case-card-paper-color: var(--todo-case-card-decoration-paper-background-color);
  }
`;
