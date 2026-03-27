import type { StoryWizardSelectionSummary } from './types';
import { cloneTemplate } from './cloneTemplate';

export class StoryWizardTokensDialog {
  #dialog: HTMLDialogElement | null = null;

  public show(title: string, groups: StoryWizardSelectionSummary[]) {
    const dialog = this.#getDialog();

    dialog.querySelector('.wizard-tokens-dialog__title')!.textContent = title;

    const body = dialog.querySelector('.wizard-tokens-dialog__body')!;
    body.replaceChildren();

    groups.forEach((group) => {
      body.appendChild(this.#createGroupSection(group));
    });

    dialog.showModal();
  }

  #getDialog(): HTMLDialogElement {
    if (this.#dialog) return this.#dialog;

    const dialog = document.getElementById('wizard-tokens-dialog') as HTMLDialogElement | null;
    if (!dialog) throw new Error('Dialog #wizard-tokens-dialog not found in DOM');

    dialog.querySelector('.wizard-tokens-dialog__close')!.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    this.#dialog = dialog;
    return dialog;
  }

  #createGroupSection(group: StoryWizardSelectionSummary): HTMLElement {
    const section = cloneTemplate<HTMLElement>('wizard-dialog-group-tmpl', '.wizard-tokens-dialog__group');

    section.querySelector('.wizard-tokens-dialog__group-title')!.textContent =
      group.label ? `${group.label}: ${group.optionLabel}` : group.optionLabel;

    const table = section.querySelector('.wizard-tokens-dialog__table')!;

    group.tokens.forEach((token) => {
      const row = cloneTemplate('wizard-dialog-row-tmpl');
      row.querySelector('.wizard-tokens-dialog__token-path')!.textContent = token.path;
      row.querySelector('.wizard-tokens-dialog__token-value')!.textContent = token.value;
      table.appendChild(row);
    });

    return section;
  }
}
