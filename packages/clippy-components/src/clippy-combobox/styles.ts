import { css } from 'lit';
export default css`
  :host {
    --nl-color-sample-block-size: var(--basis-size-xs);
    --nl-color-sample-inline-size: var(--basis-size-xs);
    --clippy-icon-size: var(--nl-color-sample-inline-size);

    --_clippy-combobox-slot-action-border-width: var(
      --utrecht-textbox-border-width,
      var(--utrecht-form-control-border-width)
    );
  }

  .clippy-combobox__slot {
    min-block-size: var(--basis-pointer-target-min-block-size, 44px);

    &:where(.utrecht-customizable-text-input__slot--start) {
      padding-inline-start: var(
        --utrecht-textbox-padding-inline-start,
        var(--utrecht-form-control-padding-inline-start, initial)
      );
    }

    &:where(.utrecht-customizable-text-input__slot--end) {
      padding-inline-end: var(
        --utrecht-textbox-padding-inline-end,
        var(--utrecht-form-control-padding-inline-end, initial)
      );
    }

    :where(clippy-icon),
    :where(clippy-icon > svg) {
      display: block;
    }
  }

  .clippy-combobox__slot--action {
    border-inline-color: var(--utrecht-textbox-border-color, var(--utrecht-form-control-border-color));
    border-inline-width: 0;
    border-inline-style: solid;

    &:where(.utrecht-customizable-text-input__slot--start) {
      border-inline-end-width: var(--_clippy-combobox-slot-action-border-width);
      padding-inline-end: var(
        --utrecht-textbox-padding-inline-end,
        var(--utrecht-form-control-padding-inline-end, initial)
      );
    }

    &:where(.utrecht-customizable-text-input__slot--end) {
      border-inline-start-width: var(--_clippy-combobox-slot-action-border-width);
      padding-inline-start: var(
        --utrecht-textbox-padding-inline-start,
        var(--utrecht-form-control-padding-inline-start, initial)
      );
    }
  }

  .clippy-combobox__wrap-input {
    position: relative;
  }

  /**
   * TODO: this reuses a lot from utrecht-textbox. Best option is just to use the utrecht-textbox classes directly.
   * But currently that creates a specificity battle.
   */
  .clippy-combobox__current-option {
    box-sizing: border-box;
    position: absolute;
    white-space: nowrap;
    align-items: center;
    display: flex;
    inline-size: 100%;
    block-size: 100%;
    overflow: hidden;
    pointer-events: none;
    font-family: var(--utrecht-textbox-font-family, var(--utrecht-form-control-font-family));
    font-size: var(--utrecht-textbox-font-size, var(--utrecht-form-control-font-size, inherit));
    font-weight: var(--utrecht-textbox-font-weight, var(--utrecht-form-control-font-weight, initial));
    line-height: var(--utrecht-textbox-line-height, var(--utrecht-form-control-line-height, initial));

    background-color: var(--utrecht-textbox-background-color, var(--utrecht-form-control-background-color));
    padding-inline-start: var(
      --utrecht-textbox-padding-inline-start,
      var(--utrecht-form-control-padding-inline-start, initial)
    );
    padding-inline-end: var(
      --utrecht-textbox-padding-inline-end,
      var(--utrecht-form-control-padding-inline-end, initial)
    );
  }

  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }

  /* added specificity to override the align-items now that the flex direction changes */
  .clippy-combobox__option[class] {
    align-items: unset;
    display: flex;
    flex-direction: column;
  }
`;
