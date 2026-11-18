import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  .clippy-html-image {
    margin-block: 0;
    margin-inline: 0;
  }

  .clippy-html-image__body {
    forced-color-adjust: none;
  }

  :host([color-scheme='dark']) .clippy-html-image__body {
    color-scheme: only dark;
  }

  :host([color-scheme='light']) .clippy-html-image__body {
    color-scheme: only light;
  }

  .clippy-html-image__body--forced-color-adjust {
    forced-color-adjust: auto;
  }
`;
