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
    border-inline-style: solid;
    border-inline-width: 0;

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

  /**
   * 1. By default the customizable text input is displayed as an inline-block element,
   *    In the combobox we want it to be displayed as a block element.
   */
  .clippy-combobox__customizable-text-input {
    display: block; /* [1] */
  }

  /**
   * 1. To override utrecht-customizable-text-input styles, we need to grow in the flex container.
   */
  .clippy-combobox__wrap-input {
    flex: 1; /* [1] */
    position: relative;
  }

  /**
   * Stretches the input to fill the available width.
   * TODO: refactor double selector for double specificity to override utrecht-customizable-text-input styles.
   */
  .clippy-combobox__input.clippy-combobox__input {
    inline-size: 100%;
    inline-size: stretch;
  }

  /**
   * TODO: this reuses a lot from utrecht-textbox. Best option is just to use the utrecht-textbox classes directly.
   * But currently that creates a specificity battle.
   * 1. utrecht-root sets a font-size-adjust, but is overridden on the input element by user-agent styles in the shadow DOM.
   *    the current-option needs to look the same as the input, so we reset the font-size-adjust to none.
   */
  .clippy-combobox__current-option {
    align-items: center;
    background-color: var(--utrecht-textbox-background-color, var(--utrecht-form-control-background-color));
    block-size: 100%;
    box-sizing: border-box;
    display: grid;
    font-family: var(--utrecht-textbox-font-family, var(--utrecht-form-control-font-family));
    font-size: var(--utrecht-textbox-font-size, var(--utrecht-form-control-font-size, inherit));
    font-size-adjust: none; /* [1] */
    font-weight: var(--utrecht-textbox-font-weight, var(--utrecht-form-control-font-weight, initial));
    inline-size: 100%;
    line-height: var(--utrecht-textbox-line-height, var(--utrecht-form-control-line-height, initial));
    overflow: hidden;
    padding-inline-end: var(
      --utrecht-textbox-padding-inline-end,
      var(--utrecht-form-control-padding-inline-end, initial)
    );
    padding-inline-start: var(
      --utrecht-textbox-padding-inline-start,
      var(--utrecht-form-control-padding-inline-start, initial)
    );
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
  }

  .clippy-combobox__current-option:has(+ input:focus) {
    display: none;
  }

  /* added specificity to override the align-items now that the flex direction changes */
  .clippy-combobox__option.clippy-combobox__option {
    --utrecht-listbox-option-padding-inline-start: var(
      --utrecht-textbox-padding-inline-start,
      var(--utrecht-form-control-padding-inline-start, initial)
    );
    --utrecht-listbox-option-padding-inline-end: var(
      --utrecht-textbox-padding-inline-end,
      var(--utrecht-form-control-padding-inline-end, initial)
    );
    align-items: unset;
    display: flex;
    flex-direction: column;
    min-block-size: var(--basis-pointer-target-min-block-size, 44px);
    justify-content: center;
  }
`;
