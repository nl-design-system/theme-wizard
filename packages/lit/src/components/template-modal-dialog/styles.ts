import { css } from 'lit';

export const dialogStyles = [
  css`
    :host {
      --ams-dialog-background-color: var(--todo-modal-dialog-background-color);
      --ams-dialog-border-color: var(--todo-modal-dialog-border-color);
      --ams-dialog-border-style: solid;
      --ams-dialog-border-width: var(--todo-modal-dialog-border-width);
      --ams-dialog-color: var(--todo-modal-dialog-color);
      --ams-dialog-box-shadow: var(--todo-modal-dialog-box-shadow);

      --ams-dialog-gap: var(--todo-modal-dialog-header-column-gap);
      --ams-dialog-inline-size: var(--todo-modal-dialog-inline-size, auto);
      --ams-dialog-max-block-size: var(--todo-modal-dialog-max-block-size, 90vh);
      --ams-dialog-max-inline-size: var(--todo-modal-dialog-max-inline-size, 37.5rem);
      --ams-dialog-medium-inline-size: var(--todo-modal-dialog-inline-size, 37.5rem);
      --ams-dialog-medium-max-block-size: var(--todo-modal-dialog-max-block-size, 90vh);

      --ams-dialog-header-gap: var(--todo-modal-dialog-header-column-gap);
      --ams-dialog-header-padding-inline: var(--todo-modal-dialog-content-padding-inline);
      --ams-dialog-header-padding-block: calc(
        var(--todo-modal-dialog-header-padding-block-start) + var(--todo-modal-dialog-header-padding-block-end)
      );
      --ams-dialog-header-medium-padding-inline: var(--ams-dialog-header-padding-inline);
      --ams-dialog-header-medium-padding-block: var(--ams-dialog-header-padding-block);

      --ams-dialog-body-padding-inline: var(--todo-modal-dialog-content-padding-inline);
      --ams-dialog-body-medium-padding-inline: var(--ams-dialog-body-padding-inline);

      --ams-dialog-footer-padding-inline: var(--todo-modal-dialog-content-padding-inline);
      --ams-dialog-footer-padding-block: calc(
        var(--todo-modal-dialog-footer-padding-block-start) + var(--todo-modal-dialog-footer-padding-block-end)
      );
      --ams-dialog-footer-medium-padding-inline: var(--ams-dialog-footer-padding-inline);
      --ams-dialog-footer-medium-padding-block: var(--ams-dialog-footer-padding-block);

      font-family: system-ui, sans-serif;
    }

    h1 {
      margin-block: 0;
      margin-inline: 0;
    }
  `,
];
