import { css } from 'lit';

export default css`
  .wizard-step-form-task-navigation-icon-start {
    border-radius: var(--basis-border-radius-round);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: center;
    place-content: center;
    inline-size: var(--basis-size-md);
    block-size: var(--basis-size-md);
    border-width: var(--basis-border-width-md);
    text-align: center;

    & svg {
      --wizard-task-navigation-icon-size: var(--basis-size-icon-md);
      inline-size: var(--wizard-task-navigation-icon-size);
      block-size: var(--wizard-task-navigation-icon-size);
      width: 100%;
      color: inherit;
    }
  }

  .wizard-step-form-task-navigation-icon-start:not(.wizard-step-form-task-navigation-icon-start--checked) {
    border-color: var(--basis-color-default-border-subtle);
    border-style: dashed;
  }

  /**
   * 1. Add border in the same color as background: this helps with adding a border in high contrast mode
   */
  .wizard-step-form-task-navigation-icon-start--checked {
    background-color: var(--basis-color-positive-inverse-bg-default);
    border-color: var(--basis-color-positive-inverse-bg-default); /* [1] */
    border-style: solid;
    color: var(--basis-color-positive-inverse-color-default);
  }
`;
