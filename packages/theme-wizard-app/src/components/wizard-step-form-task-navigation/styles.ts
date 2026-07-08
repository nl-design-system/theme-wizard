import { css } from 'lit';

export default css`
  .wizard-step-form-task-navigation-icon-start {
    --wizard-step-form-task-navigation-border-style: dashed;
    --wizard-step-form-task-navigation-border-color: var(--basis-color-default-border-subtle);
    --wizard-step-form-task-navigation-background-color: transparent;
    --wizard-step-form-task-navigation-color: currentColor;

    aspect-ratio: 1 / 1;
    color: var(--wizard-step-form-task-navigation-color);
    background-color: var(--wizard-step-form-task-navigation-background-color);
    border-color: var(--wizard-step-form-task-navigation-border-color);
    border-radius: var(--basis-border-radius-round);
    border-style: var(--wizard-step-form-task-navigation-border-style);
    border-width: var(--basis-border-width-md);
    display: grid;
    inline-size: var(--basis-size-md);

    & svg {
      block-size: var(--basis-size-icon-md);
      color: inherit;
      place-self: center center;
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
