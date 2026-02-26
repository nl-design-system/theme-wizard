import { css } from 'lit';

export default css`
  :host {
    --wizard-tokens-form-row-gap: var(--basis-space-block-md);
  }

  form {
    display: grid;
    row-gap: var(--wizard-tokens-form-row-gap);
  }

  .wizard-app__basis-tokens {
    display: grid;
    margin-block: 0;
    padding-inline-start: 0;
    row-gap: var(--wizard-tokens-form-row-gap);

    > li {
      list-style-type: none;
    }
  }

  [type='reset'] {
    justify-self: start;
    min-block-size: auto;
    padding-block: 0;
    padding-inline: 0;
  }
`;
