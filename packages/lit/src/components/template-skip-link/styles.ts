import { css } from 'lit';

export default css`
  /* Override position to absolute to move the position to in the preview */
  /* stylelint-disable-next-line selector-class-pattern */
  .nl-skip-link--visible-on-focus:focus {
    position: absolute;
  }
`;
