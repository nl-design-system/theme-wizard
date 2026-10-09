import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --_wizard-unstyled-list-row-gap: var(--wizard-unstyled-list-row-gap, var(--basis-space-row-md));
  }

  .wizard-unstyled-list {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    margin-block: var(--basis-space-none);
    padding-inline-start: var(--basis-space-none);
    row-gap: var(--_wizard-unstyled-list-row-gap);
  }
`;
