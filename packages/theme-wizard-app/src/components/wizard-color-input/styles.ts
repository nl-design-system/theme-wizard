import { css } from 'lit';
import { tokenLinkStyles } from '../wizard-token-navigator/styles';

export default css`
  :host {
    align-items: center;
    display: grid;
    gap: var(--basis-space-column-md);
    grid-template-columns: 1fr auto;
    justify-content: space-between;
  }

  ul {
    margin-block: 0;
    padding-inline: 0;
  }

  ${tokenLinkStyles}
`;
