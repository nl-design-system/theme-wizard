import { css } from 'lit';

export default css`
  :host {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-block: 1rem;
    margin-inline: 1rem;
    min-block-size: 0;
    padding-block: 1rem;
    padding-inline: 1rem;
  }

  iframe {
    background: transparent;
    block-size: 100%;
    border: 0;
    flex: 1;
    inline-size: 100%;
    min-block-size: 0;
  }
`;
