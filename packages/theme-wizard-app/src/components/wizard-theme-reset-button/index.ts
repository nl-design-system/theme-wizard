import { consume } from '@lit/context';
import '@nl-design-system-community/clippy-components/clippy-button';
import { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';
import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import type Theme from '../../lib/Theme';
import { themeContext } from '../../contexts/theme';
import { t } from '../../i18n';
import { isClippyModal } from '../../utils/assertions';

const tag = 'wizard-theme-reset-button';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardThemeResetButton;
  }
}

@customElement(tag)
export class WizardThemeResetButton extends LitElement {
  @consume({ context: themeContext, subscribe: true })
  private readonly theme!: Theme;

  @query('clippy-modal')
  private readonly modalDialog!: ClippyModal;

  readonly #handleClick = () => {
    this.modalDialog?.open();
  };

  readonly #handleDialogClose = (event: Event) => {
    const dialog = event.currentTarget;
    if (!isClippyModal(dialog)) return;
    if (dialog.returnValue === 'confirm') {
      this.dispatchEvent(new Event('reset', { bubbles: true, composed: true }));
    }
  };

  override render() {
    return html`
      <clippy-modal
        .title=${t('themeResetDialog.title')}
        actions="both"
        .confirmLabel=${t('themeResetDialog.confirm')}
        .cancelLabel=${t('themeResetDialog.cancel')}
        @close=${this.#handleDialogClose}
      >
        <p>${t('themeResetDialog.body')}</p>
      </clippy-modal>

      <div @click=${this.#handleClick} style="display:contents">
        <slot>
          <clippy-button purpose="subtle" hint="negative" type="button" ?disabled=${!this.theme.modified}>
            ${t('themeResetDialog.triggerText')}
          </clippy-button>
        </slot>
      </div>
    `;
  }
}
