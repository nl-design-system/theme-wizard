import { css } from 'lit';

export default css`
  /**
   * Whenever the writing direction of an element inside the option is different, we want to align it differently.
   * For both scenarios that would come down to "justify:content: flex-end"
   */
  .clippy-combobox__option:dir(ltr):has(*:dir(rtl)),
  .clippy-combobox__option:dir(rtl):has(*:dir(ltr)),
  .clippy-combobox__current-option:dir(ltr):has(*:dir(rtl)),
  .clippy-combobox__current-option:dir(rtl):has(*:dir(ltr)) {
    justify-content: flex-end;
  }
`;
