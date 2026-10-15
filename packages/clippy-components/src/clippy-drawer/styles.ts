import { css } from 'lit';

export default css`
  :host {
    .ams-modal-dialog {
      --clippy-drawer-max-inline-size: 24rem;
      --clippy-drawer-backdrop-min-size: var(--basis-pointer-target-min-inline-size, 44px);
      --ams-modal-dialog-max-block-size: none;
      --ams-modal-dialog-medium-max-block-size: var(--ams-modal-dialog-max-block-size);
      --ams-modal-dialog-inline-size: calc(100% - var(--clippy-drawer-backdrop-min-size));
      --ams-modal-dialog-medium-inline-size: var(--ams-modal-dialog-inline-size);
      --ams-modal-dialog-max-inline-size: var(--clippy-drawer-max-inline-size);
      --ams-modal-dialog-border-radius: var(--basis-border-radius-none);
      --ams-modal-dialog-border-width: var(--basis-border-width-none);

      block-size: 100vb;
    }
  }

  :host([side='inline-start']) {
    .ams-modal-dialog {
      margin-inline-start: var(--basis-space-none);
    }
  }

  :host([side='inline-end']) {
    .ams-modal-dialog {
      margin-inline-end: var(--basis-space-none);
    }
  }
`;
