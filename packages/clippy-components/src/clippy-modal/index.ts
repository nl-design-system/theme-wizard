import amsDialogStyles from '@amsterdam/design-system-css/dist/dialog/dialog.css?inline';
import { safeCustomElement } from '@lib/decorators';
import buttonStyles from '@nl-design-system-candidate/button-css/button.css?inline';
import './../clippy-button'
import './../clippy-icon'
import CloseIcon from '@tabler/icons/outline/x.svg?raw';
import { LitElement, html, unsafeCSS,  nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { dialogStyles } from './styles';

let dialogInstanceCounter = 0;

const tag = 'clippy-modal';

export const DIALOG_BUTTON_VALUES = {
  cancel: 'cancel',
  confirm: 'confirm',
};

@safeCustomElement(tag)
export class ClippyModal extends LitElement {
  /**
   * Id of an element that describes the dialog, used for aria-describedby.
   * Consumers are responsible for rendering that element in the light DOM.
   */
  @property({ attribute: 'aria-describedby', type: String })
  ariaDescribedby = '';
  /**
   * When loading the page, the dialog is not open by default.
   */
  @property({ type: Boolean })
  standardOpen = false;
  @property({ type: String }) override title = '';
  @property({ type: String }) closedBy = 'any';
  /**
   * Control which footer actions are rendered.
   * - "none": no footer actions
   * - "cancel": only cancel button
   * - "confirm": only confirm button
   * - "both": both confirm and cancel buttons
   */
  @property({ type: String })
  actions: 'none' | 'cancel' | 'confirm' | 'both' = 'cancel';
  /**
   * Button labels for confirm/cancel actions. Consumers can override these,
   * e.g. with localized strings.
   */
  @property({ type: String }) confirmLabel = 'OK';
  @property({ type: String }) cancelLabel = 'Cancel';

  @query('dialog')
  readonly dialogElement!: HTMLDialogElement;

  private readonly titleId = `clippy-modal-title-${++dialogInstanceCounter}`;

  private previouslyFocusedElement: HTMLElement | null = null;

  static override readonly styles = [
    dialogStyles,
    unsafeCSS(amsDialogStyles),
    unsafeCSS(buttonStyles),
  ];

  readonly open = () => {
    if (!this.dialogElement) return;

    const root = this.getRootNode() as Document | ShadowRoot;
    this.previouslyFocusedElement = root.activeElement as HTMLElement | null;

    this.dialogElement.showModal();
  };

  close(value?: string) {
    if (this.dialogElement?.open) {
      this.dialogElement.close(value);
    }
  }

  private readonly onDialogClose = () => {
    this.dispatchEvent(
      new Event('close', {
        bubbles: true,
        composed: true,
      }),
    );

    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      try {
        this.previouslyFocusedElement.focus();
      } catch {
        // Element might be disconnected; ignore.
      }
    }

    this.previouslyFocusedElement = null;
  };

  private readonly onDialogCancel = (event: Event) => {
    // Prevent the native <dialog> from closing itself so we can
    // dispatch our own close event and restore focus consistently.
    event.preventDefault();
    this.close();
  };

  private readonly onCloseClick = () => {
    this.close(DIALOG_BUTTON_VALUES.cancel);
  };

  get returnValue(): string {
    return this.dialogElement?.returnValue ?? 'No return value.';
  }

  override render() {
    return html`
      <dialog
        class="ams-dialog"
        closedby=${this.closedBy}
        aria-modal="true"
        aria-labelledby=${this.titleId}
        aria-describedby=${this.ariaDescribedby || undefined}
        @close=${this.onDialogClose}
        @cancel=${this.onDialogCancel}
        ?open=${this.standardOpen}
      >
        <form method="dialog" novalidate>
          <header class="ams-dialog__header">
            <clippy-heading level={1} id=${this.titleId}>
              <slot name="title">${this.title}</slot>
            </clippy-heading>
            <clippy-button icon-only @click=${this.onCloseClick} purpose="subtle">
              <clippy-icon slot="iconStart">${unsafeSVG(CloseIcon)}</clippy-icon>
              Sluiten
            </clippy-button>
          </header>
          <div class="ams-dialog__body">
            <slot></slot>
          </div>
          <footer class="ams-dialog__footer">
            <!-- using utrecht-button here disrupts the dialog form flow since it's in the shadow DOM. -->
            ${this.actions === 'confirm' || this.actions === 'both'
              ? html`
                  <button class="nl-button nl-button--primary" value=${DIALOG_BUTTON_VALUES.confirm}>
                    ${this.confirmLabel}
                  </button>
                `
              : nothing}
            ${this.actions === 'cancel' || this.actions === 'both'
              ? html`
                  <button class="nl-button nl-button--secondary" value=${DIALOG_BUTTON_VALUES.cancel}>
                    ${this.cancelLabel}
                  </button>
                `
              : nothing}
          </footer>
        </form>
      </dialog>
    `;
  }
}
