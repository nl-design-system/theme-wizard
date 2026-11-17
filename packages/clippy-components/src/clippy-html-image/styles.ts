import { css } from 'lit';

export default css`
  :host {
    display: contents;
  }

  .ma-html-image {
    margin-block: 0;
    margin-inline: 0;
  }

  .ma-html-image__body {
    forced-color-adjust: none;
  }

  :host([color-scheme='dark']) .ma-html-image__body {
    color-scheme: only dark;
  }

  :host([color-scheme='light']) .ma-html-image__body {
    color-scheme: only light;
  }

  .ma-html-image__body--forced-color-adjust {
    forced-color-adjust: auto;
  }
`;
