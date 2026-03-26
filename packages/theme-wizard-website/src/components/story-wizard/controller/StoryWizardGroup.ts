import type { WizardTokenPresetInput } from './types';

export class StoryWizardGroup {
  public readonly input: WizardTokenPresetInput | null;

  public constructor(public readonly element: HTMLElement) {
    this.input = element.querySelector<WizardTokenPresetInput>('.wizard-token-preset__input');
  }

  public get groupLabel() {
    return this.element.dataset.groupLabel?.trim() ?? '';
  }

  public getSelectedOption() {
    return this.input?.selectedOption ?? null;
  }

  public getSelectedIndex() {
    return this.input?.selectedIndex ?? -1;
  }

  public hasSelection() {
    return this.getSelectedIndex() >= 0;
  }

  public clearSelection() {
    this.input?.clearSelection();
  }

  public restoreSelectedIndex(index: number) {
    this.input?.selectIndex(index);
  }

  public bindOptions(listener: () => void) {
    this.input?.addEventListener('change', listener);
  }
}
