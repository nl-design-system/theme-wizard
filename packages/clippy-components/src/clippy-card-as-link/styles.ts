import { css } from 'lit';

export default css`
  :host {
    /* case (14) */
    --_clippy-card-case-background-color: var(
      --clippy-card-case-background-color,
      var(--basis-color-accent-1-bg-default)
    );
    --_clippy-card-case-border-color: var(--clippy-card-case-border-color, var(--basis-color-transparent));
    --_clippy-card-case-color: var(--clippy-card-case-color, var(--basis-color-default-color-document));
    --_clippy-card-case-min-block-size: var(--clippy-card-case-min-block-size, 12rem);
    --_clippy-card-case-decoration-background-color: var(
      --clippy-card-case-decoration-background-color,
      var(--basis-color-accent-1-bg-active)
    );
    --_clippy-card-case-decoration-paper-background-color: var(
      --clippy-card-case-decoration-paper-background-color,
      #fff
    );
    --_clippy-card-case-decoration-paper-border-radius: var(
      --clippy-card-case-decoration-paper-border-radius,
      var(--basis-border-radius-none)
    );
    --_clippy-card-case-heading-color: var(--clippy-card-case-heading-color, var(--basis-heading-color));
    --_clippy-card-case-archived-background-color: var(
      --clippy-card-case-archived-background-color,
      var(--basis-color-default-bg-default)
    );
    --_clippy-card-case-archived-border-color: var(
      --clippy-card-case-archived-border-color,
      var(--basis-color-transparent)
    );
    --_clippy-card-case-archived-color: var(
      --clippy-card-case-archived-color,
      var(--basis-color-default-color-document)
    );
    --_clippy-card-case-archived-decoration-background-color: var(
      --clippy-card-case-archived-decoration-background-color,
      var(--basis-color-default-bg-active)
    );
    --_clippy-card-case-archived-heading-color: var(
      --clippy-card-case-archived-heading-color,
      var(--basis-heading-color)
    );
    --_clippy-card-case-archived-link-icon-color: var(
      --clippy-card-case-archived-link-icon-color,
      var(--basis-color-default-color-default)
    );

    /* plan (21) */
    --_clippy-card-plan-background-color: var(
      --clippy-card-plan-background-color,
      var(--basis-color-accent-1-bg-default)
    );
    --_clippy-card-plan-border-color: var(--clippy-card-plan-border-color, var(--basis-color-accent-1-bg-active));
    --_clippy-card-plan-border-width: var(--clippy-card-plan-border-width, 8px);
    --_clippy-card-plan-color: var(--clippy-card-plan-color, var(--basis-color-default-color-document));
    --_clippy-card-plan-min-block-size: var(--clippy-card-plan-min-block-size, 12rem);
    --_clippy-card-plan-decoration-clip-color: var(
      --clippy-card-plan-decoration-clip-color,
      var(--basis-color-accent-1-border-subtle)
    );
    --_clippy-card-plan-body-padding-inline-end: var(
      --clippy-card-plan-body-padding-inline-end,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-body-padding-inline-start: var(
      --clippy-card-plan-body-padding-inline-start,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-footer-padding-block-end: var(
      --clippy-card-plan-footer-padding-block-end,
      var(--basis-space-block-3xl)
    );
    --_clippy-card-plan-footer-padding-inline-end: var(
      --clippy-card-plan-footer-padding-inline-end,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-footer-padding-inline-start: var(
      --clippy-card-plan-footer-padding-inline-start,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-header-padding-inline-end: var(
      --clippy-card-plan-header-padding-inline-end,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-header-padding-inline-start: var(
      --clippy-card-plan-header-padding-inline-start,
      var(--basis-space-inline-3xl)
    );
    --_clippy-card-plan-heading-color: var(--clippy-card-plan-heading-color, var(--basis-heading-color));
    --_clippy-card-plan-link-icon-color: var(--clippy-card-plan-link-icon-color, var(--_clippy-card-link-icon-color));
    --_clippy-card-plan-archived-background-color: var(
      --clippy-card-plan-archived-background-color,
      var(--basis-color-default-bg-default)
    );
    --_clippy-card-plan-archived-border-color: var(
      --clippy-card-plan-archived-border-color,
      var(--basis-color-default-bg-active)
    );
    --_clippy-card-plan-archived-color: var(
      --clippy-card-plan-archived-color,
      var(--basis-color-default-color-document)
    );
    --_clippy-card-plan-archived-heading-color: var(
      --clippy-card-plan-archived-heading-color,
      var(--basis-heading-color)
    );
    --_clippy-card-plan-archived-link-icon-color: var(
      --clippy-card-plan-archived-link-icon-color,
      var(--basis-color-default-color-default)
    );
    --_clippy-card-plan-archived-decoration-clip-color: var(
      --clippy-card-plan-archived-decoration-clip-color,
      var(--basis-color-default-border-subtle)
    );

    /* product (3) */
    --_clippy-card-product-border-block-start-color: var(
      --clippy-card-product-border-block-start-color,
      var(--basis-color-accent-1-border-default)
    );
    --_clippy-card-product-border-block-start-width: var(
      --clippy-card-product-border-block-start-width,
      var(--basis-border-width-lg)
    );
    --_clippy-card-product-border-radius: var(--clippy-card-product-border-radius, var(--basis-border-radius-none));

    /* task (8) */
    --_clippy-card-task-border-radius: var(--clippy-card-task-border-radius, var(--basis-border-radius-none));
    --_clippy-card-task-border-width: var(--clippy-card-task-border-width, var(--basis-border-width-sm));
    --_clippy-card-task-body-padding-block-start: var(
      --clippy-card-task-body-padding-block-start,
      var(--basis-space-block-xl)
    );
    --_clippy-card-task-footer-padding-inline-start: var(
      --clippy-card-task-footer-padding-inline-start,
      var(--basis-space-none)
    );
    --_clippy-card-task-pre-header-padding-block-end: var(
      --clippy-card-task-pre-header-padding-block-end,
      var(--basis-space-block-xl)
    );
    --_clippy-card-task-pre-header-padding-block-start: var(
      --clippy-card-task-pre-header-padding-block-start,
      var(--basis-space-block-xl)
    );
    --_clippy-card-task-pre-header-padding-inline-start: var(
      --clippy-card-task-pre-header-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-task-checked-icon-color: var(
      --clippy-card-task-checked-icon-color,
      var(--basis-color-positive-color-default)
    );

    /* topic (6) */
    --_clippy-card-topic-border-radius: var(--clippy-card-topic-border-radius, var(--basis-border-radius-none));
    --_clippy-card-topic-border-width: var(--clippy-card-topic-border-width, var(--basis-border-width-sm));
    --_clippy-card-topic-icon-color: var(--clippy-card-topic-icon-color, var(--basis-color-accent-1-color-default));
    --_clippy-card-topic-icon-size: var(--clippy-card-topic-icon-size, var(--basis-size-icon-xl));
    --_clippy-card-topic-pre-header-padding-block-start: var(
      --clippy-card-topic-pre-header-padding-block-start,
      var(--basis-space-block-xl)
    );
    --_clippy-card-topic-pre-header-padding-inline-start: var(
      --clippy-card-topic-pre-header-padding-inline-start,
      var(--basis-space-inline-xl)
    );

    /* toptask (7) */
    --_clippy-card-toptask-background-color: var(
      --clippy-card-toptask-background-color,
      var(--basis-color-accent-1-inverse-bg-default)
    );
    --_clippy-card-toptask-border-color: var(--clippy-card-toptask-border-color, var(--basis-color-transparent));
    --_clippy-card-toptask-color: var(--clippy-card-toptask-color, var(--basis-color-accent-1-inverse-color-default));
    --_clippy-card-toptask-icon-size: var(--clippy-card-toptask-icon-size, var(--basis-size-icon-4xl));
    --_clippy-card-toptask-label-color: var(
      --clippy-card-toptask-label-color,
      var(--basis-color-accent-1-inverse-color-default)
    );
    --_clippy-card-toptask-pre-header-padding-block-start: var(
      --clippy-card-toptask-pre-header-padding-block-start,
      var(--basis-space-block-xl)
    );
    --_clippy-card-toptask-pre-header-padding-inline-start: var(
      --clippy-card-toptask-pre-header-padding-inline-start,
      var(--basis-space-inline-xl)
    );
  }

  /* APPEARANCE: CASE */

  :host([appearance='case' i]) {
    background-color: var(--_clippy-card-case-background-color);
    border-color: var(--_clippy-card-case-border-color);
    color: var(--_clippy-card-case-color);
    min-block-size: var(--_clippy-card-case-min-block-size);
    position: relative;
  }

  /* 1. Small accent tab peeking above the top edge — rough approximation, not pixel-matched to Figma. */
  :host([appearance='case' i])::before {
    /* [1] */
    background-color: var(--_clippy-card-case-decoration-background-color);
    block-size: 0.75rem;
    border-start-end-radius: var(--_clippy-card-case-decoration-paper-border-radius);
    border-start-start-radius: var(--_clippy-card-case-decoration-paper-border-radius);
    content: '';
    inline-size: 2.5rem;
    inset-block-start: -0.375rem;
    inset-inline-start: 1rem;
    position: absolute;
  }

  :host([appearance='case' i][archived]) {
    background-color: var(--_clippy-card-case-archived-background-color);
    border-color: var(--_clippy-card-case-archived-border-color);
    color: var(--_clippy-card-case-archived-color);
  }

  /* APPEARANCE: PLAN */

  :host([appearance='plan' i]) {
    background-color: var(--_clippy-card-plan-background-color);
    border-color: var(--_clippy-card-plan-border-color);
    border-width: var(--_clippy-card-plan-border-width);
    color: var(--_clippy-card-plan-color);
    min-block-size: var(--_clippy-card-plan-min-block-size);
    position: relative;
  }

  /* Same approximation as the case decoration, using plan's single clip-color token. */
  :host([appearance='plan' i])::before {
    background-color: var(--_clippy-card-plan-decoration-clip-color);
    block-size: 0.75rem;
    border-start-end-radius: var(--_clippy-card-border-radius);
    border-start-start-radius: var(--_clippy-card-border-radius);
    content: '';
    inline-size: 2.5rem;
    inset-block-start: -0.375rem;
    inset-inline-start: 1rem;
    position: absolute;
  }

  :host([appearance='plan' i]) .clippy-card__body {
    padding-inline-end: var(--_clippy-card-plan-body-padding-inline-end);
    padding-inline-start: var(--_clippy-card-plan-body-padding-inline-start);
  }

  :host([appearance='plan' i]) .clippy-card__header {
    padding-inline-end: var(--_clippy-card-plan-header-padding-inline-end);
    padding-inline-start: var(--_clippy-card-plan-header-padding-inline-start);
  }

  :host([appearance='plan' i]) .clippy-card__footer {
    padding-block-end: var(--_clippy-card-plan-footer-padding-block-end);
    padding-inline-end: var(--_clippy-card-plan-footer-padding-inline-end);
    padding-inline-start: var(--_clippy-card-plan-footer-padding-inline-start);
  }

  :host([appearance='plan' i][archived]) {
    background-color: var(--_clippy-card-plan-archived-background-color);
    border-color: var(--_clippy-card-plan-archived-border-color);
    color: var(--_clippy-card-plan-archived-color);
  }

  /* APPEARANCE: PRODUCT */

  :host([appearance='product' i]) {
    border-block-start-color: var(--_clippy-card-product-border-block-start-color);
    border-block-start-width: var(--_clippy-card-product-border-block-start-width);
    border-radius: var(--_clippy-card-product-border-radius);
  }

  /* APPEARANCE: TASK */

  :host([appearance='task' i]) {
    border-radius: var(--_clippy-card-task-border-radius);
    border-width: var(--_clippy-card-task-border-width);
  }

  :host([appearance='task' i]) .clippy-card__pre-header {
    padding-block-end: var(--_clippy-card-task-pre-header-padding-block-end);
    padding-block-start: var(--_clippy-card-task-pre-header-padding-block-start);
    padding-inline-start: var(--_clippy-card-task-pre-header-padding-inline-start);
  }

  :host([appearance='task' i]) .clippy-card__body {
    padding-block-start: var(--_clippy-card-task-body-padding-block-start);
  }

  :host([appearance='task' i]) .clippy-card__footer {
    padding-inline-start: var(--_clippy-card-task-footer-padding-inline-start);
  }

  /* APPEARANCE: TOPIC */

  :host([appearance='topic' i]) {
    border-radius: var(--_clippy-card-topic-border-radius);
    border-width: var(--_clippy-card-topic-border-width);
  }

  :host([appearance='topic' i]) .clippy-card__pre-header {
    padding-block-start: var(--_clippy-card-topic-pre-header-padding-block-start);
    padding-inline-start: var(--_clippy-card-topic-pre-header-padding-inline-start);
  }

  /* APPEARANCE: TOPTASK */

  :host([appearance='toptask' i]) {
    background-color: var(--_clippy-card-toptask-background-color);
    border-color: var(--_clippy-card-toptask-border-color);
    color: var(--_clippy-card-toptask-color);
  }

  :host([appearance='toptask' i]) .clippy-card__pre-header {
    padding-block-start: var(--_clippy-card-toptask-pre-header-padding-block-start);
    padding-inline-start: var(--_clippy-card-toptask-pre-header-padding-inline-start);
  }
`;
