import { css } from 'lit';

export default css`
  :host {
    .ams-dialog {
      --clippy-drawer-max-inline-size: 24rem;
      --clippy-drawer-backdrop-min-size: var(--basis-pointer-target-min-inline-size, 44px);

      --ams-dialog-max-block-size: none;
      --ams-dialog-medium-max-block-size: var(--ams-dialog-max-block-size);
      --ams-dialog-inline-size: calc(100% - var(--clippy-drawer-backdrop-min-size));
      --ams-dialog-medium-inline-size: var(--ams-dialog-inline-size);
      --ams-dialog-max-inline-size: var(--clippy-drawer-max-inline-size);
      --ams-dialog-border-radius: 0px;
      --ams-dialog-border-width: 0px;

      block-size: 100vb;
    }
  }

  :host([side='inline-start']) {
    .ams-dialog {
      margin-inline-start: 0;
    }
  }

  :host([side='inline-end']) {
    .ams-dialog {
      margin-inline-end: 0;
    }
  }
`;
