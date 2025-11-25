import { css } from 'lit';
import { tokenLinkStyles } from '../wizard-token-navigator/styles';

export default css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block-end: 0.5rem;
  }

  ${tokenLinkStyles}
`;
