import { css } from 'lit';

export const amsModalDialogOverideStyles = css`
  :host {
    --ams-modal-dialog-vi-medium-max-block-size: var(--ams-modal-dialog-max-block-size);
    --ams-modal-dialog-header-vi-medium-padding-block: var(--basis-space-block-3xl);
    --ams-modal-dialog-header-vi-medium-padding-inline: var(--basis-space-inline-3xl);
    --ams-modal-dialog-body-min-block-size: var(--basis-space-none);
    --ams-modal-dialog-body-padding-block: var(--basis-space-none) var(--basis-space-block-3xl);
    --ams-modal-dialog-body-vi-medium-padding-block: var(--ams-modal-dialog-body-padding-block);
    --ams-modal-dialog-body-vi-medium-padding-inline: var(--basis-space-inline-3xl);
    --ams-modal-dialog-footer-padding-block: var(--basis-space-none) var(--basis-space-block-3xl);
    --ams-modal-dialog-footer-vi-medium-padding-block: var(--ams-modal-dialog-footer-padding-block);
    --ams-modal-dialog-footer-vi-medium-padding-inline: var(--basis-space-inline-3xl);
  }
`;
