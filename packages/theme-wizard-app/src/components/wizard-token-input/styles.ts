import { css } from 'lit';
import { tokenLinkStyles } from '../wizard-token-navigator/styles';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  label {
    display: block;
  }

  ${tokenLinkStyles}
`;
