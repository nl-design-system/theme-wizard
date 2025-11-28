import amsDialogStyles from '@amsterdam/design-system-css/dist/dialog/dialog.css?inline';
import amsVisuallyHiddenStyles from '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css?inline';
import utrechtButtonStyles from '@utrecht/button-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { dialogStyles } from './styles';

let dialogInstanceCounter = 0;

export const BUTTON_VALUES = {
  cancel: 'cancel',
  confirm: 'confirm',
};

@customElement('template-modal-dialog')
export class TemplateModalDialog extends LitElement {
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
   * Control whether the primary (confirm) and secondary (cancel) buttons
   * in the footer are rendered.
   */
  @property({ type: Boolean }) showConfirmButton = false;
  @property({ type: Boolean }) showCancelButton = true;
  /**
   * Button labels for confirm/cancel actions. Consumers can override these,
   * e.g. with localized strings.
   */
  @property({ type: String }) confirmLabel = 'OK';
  @property({ type: String }) cancelLabel = 'Cancel';

  @query('dialog')
  readonly dialogElement!: HTMLDialogElement;

  private readonly titleId = `template-modal-dialog-title-${++dialogInstanceCounter}`;

  private previouslyFocusedElement: HTMLElement | null = null;

  static override readonly styles = [
    dialogStyles,
    unsafeCSS(amsDialogStyles),
    unsafeCSS(amsVisuallyHiddenStyles),
    unsafeCSS(utrechtButtonStyles),
  ];

  readonly open = () => {
    if (!this.dialogElement) return;

    const root = this.getRootNode() as Document | ShadowRoot;
    this.previouslyFocusedElement = (root as Document | ShadowRoot).activeElement as HTMLElement | null;

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
    this.close(BUTTON_VALUES.cancel);
  };

  private readonly onCloseClick = () => {
    this.close(BUTTON_VALUES.cancel);
  };

  get returnValue(): string {
    return this.dialogElement?.returnValue ?? '';
  }

  override render() {
    return html`
      <dialog
        class="ams-dialog"
        closedBy=${this.closedBy}
        aria-modal="true"
        aria-labelledby=${this.titleId}
        aria-describedby=${this.ariaDescribedby || undefined}
        @close=${this.onDialogClose}
        @cancel=${this.onDialogCancel}
        ?open=${this.standardOpen}
      >
        <form method="dialog" novalidate>
          <header class="ams-dialog__header">
            <h1 id=${this.titleId}>
              <slot name="title">${this.title}</slot>
            </h1>
            <button class="utrecht-button utrecht-button--primary-action" type="button" @click=${this.onCloseClick}>
              <span class="ams-visually-hidden">Sluiten</span>
              <div style=" --utrecht-icon-size: 8px;">
                <utrecht-icon-close></utrecht-icon-close>
              </div>
            </button>
          </header>
          <div class="ams-dialog__body">
            <slot></slot>
          </div>
          <footer class="ams-dialog__footer">
            <!-- using utrecht-button here disrupts the dialog form flow since it's in the shadow DOM. -->
            ${this.showConfirmButton
              ? html`
                  <button class="utrecht-button utrecht-button--primary-action" value=${BUTTON_VALUES.confirm}>
                    ${this.confirmLabel}
                  </button>
                `
              : null}
            ${this.showCancelButton
              ? html`
                  <button class="utrecht-button utrecht-button--secondary-action" value=${BUTTON_VALUES.cancel}>
                    ${this.cancelLabel}
                  </button>
                `
              : null}
          </footer>
        </form>
      </dialog>
    `;
  }
}
