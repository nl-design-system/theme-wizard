import { css } from 'lit';

export default css`
  .wizard-step-form-task-navigation-icon-start {
    align-items: center;
    block-size: var(--basis-size-md);
    border-radius: var(--basis-border-radius-round);
    border-width: var(--basis-border-width-md);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    inline-size: var(--basis-size-md);
    justify-content: center;
    text-align: center;

    & svg {
      block-size: var(--basis-size-icon-md);
      color: inherit;
      inline-size: 100%;
    }
  }

  .wizard-step-form-task-navigation-icon-start:not(.wizard-step-form-task-navigation-icon-start--checked) {
    border-color: var(--basis-color-default-border-subtle);
    border-style: dashed;
  }

  /**
   * 1. Add border in the same color as background: this helps with adding a border in high contrast mode
   *    and keeps the size the same as the 'checked' state.
   */
  .wizard-step-form-task-navigation-icon-start--checked {
    background-color: var(--basis-color-positive-inverse-bg-default);
    border-color: var(--basis-color-positive-inverse-bg-default); /* [1] */
    border-style: solid;
    color: var(--basis-color-positive-inverse-color-default);
  }
`;
