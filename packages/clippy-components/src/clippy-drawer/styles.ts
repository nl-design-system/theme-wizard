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
      --ams-dialog-border-radius: var(--basis-border-radius-none);
      --ams-dialog-border-width: var(--basis-border-width-none);

      block-size: 100vb;
    }
  }

  :host([side='inline-start']) {
    .ams-dialog {
      margin-inline-start: var(--basis-space-none);
    }
  }

  :host([side='inline-end']) {
    .ams-dialog {
      margin-inline-end: var(--basis-space-none);
    }
  }
`;
