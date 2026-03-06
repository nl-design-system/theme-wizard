import { css } from 'lit';

export default css`
  @supports (appearance: base-select) {
    .utrecht-select,
    .utrecht-select ::picker(select) {
      appearance: base-select;
    }

    .utrecht-select {
      background-color: var(--basis-color-transparent);
      border-color: var(--basis-color-transparent);
      font-weight: var(--basis-text-font-weight-bold);
      color: var(--basis-color-accent-1-color-default);

      &::picker-icon {
        display: none;
      }

      &:hover {
        background-color: var(--basis-color-accent-1-bg-hover);
      }
    }

    .wizard-dropdown__arrow {
      fill: var(--basis-color-accent-1-color-subtle);
      vertical-align: baseline;
    }
  }
`;
