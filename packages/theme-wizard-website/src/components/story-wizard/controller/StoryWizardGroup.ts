import type { WizardTokenPresetInput } from './types';
import { StoryWizardOption } from './StoryWizardOption';

export class StoryWizardGroup {
  public readonly options: StoryWizardOption[];
  #selectedIndex = -1;

  public constructor(public readonly element: HTMLElement) {
    this.options = Array.from(element.querySelectorAll<WizardTokenPresetInput>('.wizard-token-preset__input')).map(
      (input) => new StoryWizardOption(input),
    );
  }

  public get groupLabel() {
    return this.element.dataset.groupLabel?.trim() ?? '';
  }

  public getSelectedOption() {
    return this.options[this.#selectedIndex];
  }

  public getSelectedIndex() {
    return this.#selectedIndex;
  }

  public hasSelection() {
    return this.#selectedIndex >= 0;
  }

  public clearSelection() {
    this.#selectedIndex = -1;
  }

  public restoreSelectedIndex(index: number) {
    if (index < 0 || index >= this.options.length) return;
    this.#selectedIndex = index;
    this.options[index]?.dispatchChange();
  }

  public bindOptions(listener: () => void) {
    this.options.forEach((option, index) => {
      option.bindChange(() => {
        this.#selectedIndex = index;
        listener();
      });
    });
  }
}
