import type { StoryWizardSelectionSummary } from './types';

export class StoryWizardTokensDialog {
  private dialog: HTMLDialogElement | null = null;

  public show(title: string, groups: StoryWizardSelectionSummary[]) {
    const dialog = this.getOrCreate();

    dialog.querySelector('.wizard-tokens-dialog__title')!.textContent = title;

    const body = dialog.querySelector('.wizard-tokens-dialog__body')!;
    body.replaceChildren();

    groups.forEach((group) => {
      body.appendChild(this.createGroupSection(group));
    });

    dialog.showModal();
  }

  private getOrCreate(): HTMLDialogElement {
    if (this.dialog) return this.dialog;

    const dialog = document.createElement('dialog');
    dialog.className = 'wizard-tokens-dialog';
    dialog.innerHTML = `
      <div class="wizard-tokens-dialog__inner">
        <div class="wizard-tokens-dialog__header">
          <h2 class="wizard-tokens-dialog__title"></h2>
          <button class="wizard-tokens-dialog__close nl-button nl-button--subtle" type="button" aria-label="Sluiten">\u2715</button>
        </div>
        <div class="wizard-tokens-dialog__body"></div>
      </div>
    `;

    dialog.querySelector('.wizard-tokens-dialog__close')!.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    (document.querySelector('theme-wizard-app') ?? document.body).appendChild(dialog);
    this.dialog = dialog;
    return dialog;
  }

  private createGroupSection(group: StoryWizardSelectionSummary): HTMLElement {
    const section = document.createElement('section');
    section.className = 'wizard-tokens-dialog__group';

    const title = document.createElement('h3');
    title.className = 'wizard-tokens-dialog__group-title';
    title.textContent = group.label ? `${group.label}: ${group.optionLabel}` : group.optionLabel;
    section.appendChild(title);

    const table = document.createElement('table');
    table.className = 'wizard-tokens-dialog__table';

    group.tokens.forEach((token) => {
      const row = document.createElement('tr');

      const pathCell = document.createElement('td');
      pathCell.className = 'wizard-tokens-dialog__token-path';
      pathCell.textContent = token.path;

      const valueCell = document.createElement('td');
      valueCell.className = 'wizard-tokens-dialog__token-value';
      valueCell.textContent = token.value;

      row.appendChild(pathCell);
      row.appendChild(valueCell);
      table.appendChild(row);
    });

    section.appendChild(table);
    return section;
  }
}
