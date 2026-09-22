import { css } from 'lit';

export default css`
  [slot='header'] {
    align-items: center;
    column-gap: var(--basis-space-column-lg);
    display: flex;
    font-weight: var(--basis-text-font-weight-bold);
    inline-size: 100%;
  }

  .wizard-step-form-task-navigation-icon-start {
    --wizard-step-form-task-navigation-border-style: dashed;
    --wizard-step-form-task-navigation-border-color: var(--basis-color-default-border-subtle);
    --wizard-step-form-task-navigation-background-color: transparent;
    --wizard-step-form-task-navigation-color: currentColor;

    aspect-ratio: 1 / 1;
    background-color: var(--wizard-step-form-task-navigation-background-color);
    border-color: var(--wizard-step-form-task-navigation-border-color);
    border-radius: var(--basis-border-radius-round);
    border-style: var(--wizard-step-form-task-navigation-border-style);
    border-width: var(--basis-border-width-md);
    color: var(--wizard-step-form-task-navigation-color);
    display: grid;
    inline-size: var(--basis-size-md);

    & svg {
      align-self: center;
      block-size: var(--basis-size-icon-md);
      color: inherit;
      justify-self: center;
    }
  }

  /**
   * 1. Add border in the same color as background: this helps with adding a border in high contrast mode
   *    and keeps the size the same as the 'checked' state.
   */
  .wizard-step-form-task-navigation-icon-start--checked {
    --wizard-step-form-task-navigation-color: var(--basis-color-positive-inverse-color-default);
    --wizard-step-form-task-navigation-background-color: var(--basis-color-positive-inverse-bg-default);
    --wizard-step-form-task-navigation-border-color: var(--wizard-step-form-task-navigation-background-color); /* [1] */
    --wizard-step-form-task-navigation-border-style: solid;
  }
`;
