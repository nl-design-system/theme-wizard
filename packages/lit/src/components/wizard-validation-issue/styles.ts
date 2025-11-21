import { css } from 'lit';
import { tokenLinkStyles } from '../wizard-token-navigator/styles';

export default css`
  :host {
    display: block;
  }

  .theme-error {
    display: block;
  }

  .utrecht-form-field-error-message {
    border-inline-start: 2px solid var(--utrecht-form-field-error-message-color, #d52b1e);
    color: var(--utrecht-form-field-error-message-color, #d52b1e);
    font-size: var(--utrecht-form-field-error-message-font-size, 0.875rem);
    margin-block-start: var(--utrecht-form-field-error-message-margin-block-start, 0.25rem);
    padding-inline-start: 0.5rem;
  }

  ${tokenLinkStyles}
`;
