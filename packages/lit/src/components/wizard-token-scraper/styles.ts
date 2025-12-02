import { css } from 'lit';

export default css`
  form {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr max-content;
    gap: var(--basis-space-inline-sm);

    & label {
      grid-row: 1;
      grid-column: 1/ -1;
    }
  }
`;
