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
      color: var(--basis-color-accent-1-color-default);
      font-weight: var(--basis-text-font-weight-bold);
      border-radius: var(--basis-border-radius-sm);

      &::picker-icon {
        display: none;
      }

      &:hover {
        background-color: var(--basis-color-accent-1-bg-hover);
      }
    }
  }
`;
