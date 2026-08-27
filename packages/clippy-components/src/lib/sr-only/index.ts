import { css } from 'lit';

export default css`
  /* stylelint-disable selector-class-pattern */
  .sr-only {
    block-size: 1px;
    border-width: 0;
    clip-path: rect(0, 0, 0, 0);
    inline-size: 1px;
    margin-block: -1px;
    margin-inline: -1px;
    overflow: hidden;
    padding-block: 0;
    padding-inline: 0;
    position: absolute;
    white-space: nowrap;
  }
`;
