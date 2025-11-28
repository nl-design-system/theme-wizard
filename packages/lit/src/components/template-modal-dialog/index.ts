import amsDialogStyles from '@amsterdam/design-system-css/dist/dialog/dialog.css?inline';
import amsVisuallyHiddenStyles from '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css?inline';
import utrechtButtonStyles from '@utrecht/button-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { dialogStyles } from './styles';

@customElement('template-modal-dialog')
export class TemplateModalDialog extends LitElement {
  @property({ type: String }) override title = '';

  @query('dialog')
  readonly dialogElement!: HTMLDialogElement;

  static override readonly styles = [
    dialogStyles,
    unsafeCSS(amsDialogStyles),
    unsafeCSS(amsVisuallyHiddenStyles),
    unsafeCSS(utrechtButtonStyles),
  ];

  open() {
    this.dialogElement?.showModal();
  }

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
  };

  private readonly onCloseClick = () => {
    this.close('cancel');
  };

  get returnValue(): string {
    return this.dialogElement?.returnValue ?? '';
  }

  override render() {
    return html`
      <dialog class="ams-dialog" @close=${this.onDialogClose}>
        <header class="ams-dialog__header">
          <h1>
            <slot name="title">${this.title}</slot>
          </h1>
          <button class="utrecht-button" type="button" @click=${this.onCloseClick}>
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
          <slot name="footer"></slot>
        </footer>
      </dialog>
    `;
  }
}
