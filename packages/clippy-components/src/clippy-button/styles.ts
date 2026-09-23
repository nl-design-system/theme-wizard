import { css } from 'lit';

export default css`
  .clippy-button--small {
    --nl-button-min-inline-size: var(--clippy-button-small-min-inline-size, 32px);
    --nl-button-min-block-size: var(--clippy-button-small-min-block-size, 32px);
    --clippy-icon-size: var(--clippy-button-small-icon, 18px);
  }

  /**
   * Subtle inverse
   * An easy solution to add an extra purpose for a subtle button on a inverse background.
   * 'nl-button--subtle-inverse' is combined in the component with the 'nl-button--subtle' class.
   * Changes are proposed in this PR: https://github.com/nl-design-system/themes/pull/1368
   * If those changes are accepted we need to refactor the component to support the 'clippy' purpose.
   */
  .nl-button:where(.nl-button--subtle-inverse) {
    color: var(--basis-color-accent-1-inverse-color-default);
  }
  .nl-button:where(.nl-button--subtle-inverse):hover {
    background-color: var(--basis-color-accent-1-inverse-bg-hover);
    color: var(--basis-color-accent-1-inverse-color-hover);
  }
  .nl-button:where(.nl-button--subtle-inverse):active {
    background-color: var(--basis-color-accent-1-inverse-bg-active);
    color: var(--basis-color-accent-1-inverse-color-active);
  }
`;
