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
  }

  .wizard-step-form-task-navigation-icon-start:not(.wizard-step-form-task-navigation-icon-start--checked) {
    border-color: var(--basis-color-default-border-subtle);
    border-style: dashed;
    border-width: var(--basis-border-width-md);
  }

  .wizard-step-form-task-navigation-icon-start--checked {
    background-color: var(--basis-color-positive-inverse-bg-default);
  }

  .wizard-step-form-task-navigation-icon-start > svg {
    --wizard-task-icon-size: var(--basis-size-icon-md);
    inline-size: var(--wizard-task-icon-size);
    block-size: var(--wizard-task-icon-size);
    color: var(--basis-color-positive-inverse-color-default);
    width: 100%;
  }
`;
