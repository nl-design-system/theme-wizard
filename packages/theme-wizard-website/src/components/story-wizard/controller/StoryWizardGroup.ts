import type { WizardTokenPresetInput } from './types';
import { StoryWizardOption } from './StoryWizardOption';

export class StoryWizardGroup {
  public readonly options: StoryWizardOption[];

  public constructor(public readonly element: HTMLElement) {
    this.options = Array.from(element.querySelectorAll<WizardTokenPresetInput>('.wizard-token-preset__input')).map(
      (input) => new StoryWizardOption(input),
    );
  }

  public get groupLabel() {
    return this.element.dataset.groupLabel?.trim() ?? '';
  }

  public getSelectedOption() {
    return this.options.find((option) => option.isChecked);
  }

  public getSelectedIndex() {
    return this.options.findIndex((option) => option.isChecked);
  }

  public hasSelection() {
    return this.getSelectedIndex() >= 0;
  }

  public restoreSelectedIndex(index: number) {
    if (index < 0) return;

    this.options.forEach((option, optionIndex) => {
      option.setChecked(optionIndex === index);
    });
  }

  public bindOptions(listener: () => void) {
    this.options.forEach((option) => option.bindChange(listener));
  }

  public getSelectionLabel() {
    const selectedOption = this.getSelectedOption();
    if (!selectedOption) return '';
    if (!this.groupLabel || !selectedOption.optionLabel) return '';

    return `${this.groupLabel}: ${selectedOption.optionLabel}`;
  }
}
